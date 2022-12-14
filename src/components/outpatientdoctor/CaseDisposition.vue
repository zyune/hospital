<template>
  <div class="disposition-service-container">
    <!-- 左侧操作区 -->
    <div class="service-main-container">
      <!-- 申请的操作栏以及表格, 做成一个卡片 -->
      <el-card v-for="(collection, index) in caseDispositions.collections" v-bind:key="collection.collectionId">
        <!-- 操作栏 -->
        <div slot="header" class="clearfix">
          <span>处置申请单 {{ index + 1 }}</span>
          <el-button
            style="float: right; margin-left: 10px"
            type="text"
            icon="el-icon-document-add"
            @click="handleAddTemplate(collection)"
            >存为模版</el-button
          >
          <el-button
            style="float: right; margin-left: 10px"
            type="text"
            icon="el-icon-s-check"
            @click="handleSubmit(collection, index)"
            :disabled="isEditable[index]"
            >开立</el-button
          >
          <el-button
            style="float: right; margin-left: 10px"
            type="text"
            icon="el-icon-delete-solid"
            :disabled="!isEditable[index]"
            >作废</el-button
          >
          <el-button
            style="float: right; margin-left: 10px"
            type="text"
            icon="el-icon-folder-checked"
            @click="handleTempSave(collection)"
            :disabled="isEditable[index]"
            >暂存</el-button
          >
          <el-button
            style="float: right; margin-left: 10px"
            type="text"
            icon="el-icon-refresh-right"
            :disabled="isEditable[index]"
            @click="handleClear(collection)"
            >清空</el-button
          >
          <el-button
            style="margin-left: 10px"
            type="text"
            icon="el-icon-circle-plus"
            @click="handleAddProjectDialog(collection)"
            :disabled="isEditable[index]"
            >新增项目</el-button
          >
        </div>
        <!-- 项目列表 -->
        <div class>
          <el-table style="width: 100%" :data="collection.projects">
            <el-table-column prop="projectName" label="项目名称"></el-table-column>
            <el-table-column prop="departmentName" label="部门名称"></el-table-column>
            <el-table-column prop="status" label="执行状态" :formatter="statusFormatter"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="text" @click="handleRemoveProject(scope.row, collection)" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <!-- 新增申请项目列表button -->
      <div>
        <el-button type="text" icon="el-icon-plus" @click="handleAddCollection">新增处置申请列表</el-button>
      </div>
    </div>
    <!-- 底部模版区 -->
    <div>
      <disposition-template
        :type="3"
        @give-project-template="useProjectTemplate"
        ref="dispositionTemplate"
      ></disposition-template>
    </div>
    <!-- 新增项目dialog -->
    <el-dialog title="新增检查项目" :visible.sync="dialogAddProject" :before-close="handleClose" width="600px">
      <div>
        <el-card shadow="hover" style="margin-bottom: 10px">
          <div slot="header">
            <span>项目基本信息</span>
          </div>
          <el-form label-position="left" label-width="80px" :model="newProject">
            <el-form-item label="项目名称">
              <el-autocomplete
                class="inline-input"
                v-model="newProject.projectName"
                :fetch-suggestions="queryProjectSearch"
                placeholder="请输入项目名称"
                :highlight-first-item="true"
                @select="handleSelectProject"
                value-key="projectName"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="所属部门">
              <el-input style="width: 180px" v-model="newProject.departmentName"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加组套" :visible.sync="dialogAddTemplate" :before-close="handleClose" width="600px">
      <el-card shadow="hover" style="margin-bottom: 10px">
        <div slot="header" class="clearfix">
          <span>处置模版内容</span>
        </div>
        <div>
          <el-table style="width: 100%" :data="newTemplate.projects">
            <el-table-column prop="projectName" label="项目名称"></el-table-column>
            <el-table-column prop="departmentName" label="部门名称"></el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div slot="header">
          <span>权限设置</span>
        </div>
        <el-form :model="newTemplate" label-position="left" label-width="80px">
          <el-form-item label="组套名称">
            <el-input v-model="newTemplate.newName"></el-input>
          </el-form-item>
          <el-form-item label="使用权限">
            <el-select v-model="newTemplate.scope" placeholder="请选择模版权限">
              <el-option
                v-for="scope in scopes"
                :key="scope.value"
                :label="scope.label"
                :value="scope.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddTemplate">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNewCollectionId, listAllProjects, saveCollection } from '@/api/project';
import { projectStatusCodeToString } from '@/utils/interpreter';
import { successDialog, failDialog } from '@/utils/notification';
import DispositionTemplate from '@/components/outpatientdoctor/DispositionTemplate';
import { saveProjectTemplate } from '@/api/projectTemplate';

export default {
  name: 'CaseDisposition',
  data() {
    return {
      dialogAddProject: false,
      newProject: { items: [] },
      currentCollection: {},
      projects: [],
      addProjectButtonDisabled: [],
      newTemplate: {},
      dialogAddTemplate: false,
      scopes: [
        {
          value: '1',
          label: '个人',
        },
        {
          value: '2',
          label: '部门',
        },
        {
          value: '3',
          label: '全院',
        },
      ],
    };
  },
  props: {
    value: Object,
  },
  computed: {
    isEditable: function () {
      console.log('disposition isEditable Updated');
      var collections = this.caseDispositions.collections;
      var isEditable = [];
      var i = 0;
      var length = collections.length;
      for (i = 0; i < length; i++) {
        if (collections[i].projects.length !== 0 && collections[i].projects[0].status !== 1) {
          isEditable.push(true);
        } else {
          isEditable.push(false);
        }
      }
      return isEditable;
    },
    caseDispositions: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleAddCollection() {
      getNewCollectionId(3).then(
        (response) => {
          const newCollectionId = response.data.data.collectionId;
          this.caseDispositions.collections.push({
            collectionId: newCollectionId,
            projects: [],
          });
        },
        (error) => {
          console.log(response.data.data);
        }
      );
    },
    statusFormatter(row, column) {
      let statusCode = row.status;
      return projectStatusCodeToString(statusCode);
    },
    queryProjectSearch(queryString, cb) {
      var projects = this.projects;
      var results = queryString ? projects.filter(this.createProjectFilter(queryString)) : projects;
      cb(results);
    },
    createProjectFilter(queryString) {
      return (project) => {
        return project.projectName.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleSelectProject(item) {
      this.newProject.departmentName = item.departmentName;
      this.newProject.projectId = item.projectId;
    },
    handleRemoveProject(row, collection) {
      collection.projects.splice(
        collection.projects.findIndex((project) => {
          project.projectName == row.projectName;
        }),
        1
      );
    },
    handleCancel() {
      this.newProject = { items: [] };
      this.dialogAddProject = false;
    },
    handleConfirmAdd() {
      this.dialogAddProject = false;
      const repeatedProject = this.currentCollection.projects.filter(
        (project) => project.projectName === this.newProject.projectName
      );
      if (repeatedProject.length === 0) {
        this.newProject.status = 1;
        this.currentCollection.projects.push(this.newProject);
        successDialog('项目添加成功');
      } else {
        failDialog('该项目已存在');
      }
      this.newProject = {};
    },
    handleAddProjectDialog(collection) {
      this.dialogAddProject = true;
      this.currentCollection = collection;
    },
    handleTempSave(collection) {
      collection.roleId = this.$store.getters['user/currentRoleId'];
      collection.caseId = this.caseDispositions.caseId;
      collection.applicantRoleId = this.$store.getters['user/currentRoleId'];
      collection.collectionType = 3;
      saveCollection(collection).then(
        (response) => {
          console.log(response);
          successDialog('暂存成功');
        },
        (error) => {
          console.log(error);
          failDialog('暂存失败');
        }
      );
    },
    handleSubmit(collection, index) {
      collection.roleId = this.$store.getters['user/currentRoleId'];
      collection.caseId = this.caseDispositions.caseId;
      collection.applicantRoleId = this.$store.getters['user/currentRoleId'];
      collection.collectionType = 3;
      // 将所有内存的project 状态都改为 2.已开立
      var i;
      var length = collection.projects.length;
      for (i = 0; i < length; i++) {
        collection.projects[i].status = 2;
      }
      saveCollection(collection).then(
        (response) => {
          console.log(response);
          if (response.data.code === 200) {
            successDialog('开立成功');
          } else {
            failDialog('开立失败');
          }
          this.$set(this.caseDispositions.collections, index, collection);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    handleClear(collection) {
      collection.projects = [];
      this.handleTempSave(collection);
    },
    useProjectTemplate(givenTemplate) {
      console.log('使用处置模版');
      console.log(givenTemplate);
      givenTemplate.roleId = this.$store.getters['user/currentRoleId'];
      givenTemplate.caseId = this.caseDispositions.caseId;
      givenTemplate.collectionType = 3;
      givenTemplate.applicantRoleId = this.$store.getters['user/currentRoleId'];
      givenTemplate.projects.forEach((project) => (project.status = 1));

      console.log(givenTemplate);

      getNewCollectionId(3).then(
        (response) => {
          const newCollectionId = response.data.data.collectionId;
          givenTemplate.collectionId = newCollectionId;
          this.caseDispositions.collections.push(givenTemplate);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    handleConfirmAddTemplate() {
      this.newTemplate.roleId = this.$store.getters['user/currentRoleId'];
      this.newTemplate.type = 3;
      this.newTemplate.departmentId = this.$store.getters['user/currentDepartmentId'];
      console.log('新处置模版：');
      console.log(this.newTemplate);
      saveProjectTemplate(this.newTemplate).then(
        (response) => {
          successDialog('成功添加模版');
          this.$refs.dispositionTemplate.listAllTemplates(this.$store.getters['user/currentRoleId'], 3);
        },
        (error) => {
          failDialog('模版添加失败');
          console.log(error);
        }
      );
      this.dialogAddTemplate = false;
    },
    handleAddTemplate(collection) {
      console.log('开始添加模版');
      this.newTemplate = Object.assign({}, collection);
      this.dialogAddTemplate = true;
    },
  },
  mounted: function () {
    listAllProjects(3).then(
      (response) => {
        this.projects = response.data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  },
  components: {
    'disposition-template': DispositionTemplate,
  },
};
</script>

<style lang="css" scoped>
.outpatient-service-container {
  display: flex;
  flex-direction: column;
}

.service-main-container {
  grid-column: 1/2;
  margin-left: 2px;
}

.service-side-container {
  grid-column: 2;
  margin-right: 2px;
}

.recipe-service-container {
  display: flex;
  flex-direction: column;
}

.recipe-template {
  display: grid;
  grid-template-columns: 40% 60%;
}

.template-tabs {
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
}

.input-card {
  margin-top: 5px;
  margin-right: 10px;
}

.diagnose-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.application-number {
  background-color: #597ef7;
  border-radius: 5px;
  font-size: 15px;
  padding: 0px 3px;
  color: white;
}

.service-main-container .el-card {
  margin-right: 5px;
}

.add-recipe-button {
  margin-top: 5px;
  margin-bottom: 5px;
}

.table-container {
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  margin-top: 5px;
}

.item-table {
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  margin-top: 5px;
  width: 100%;
}
</style>
