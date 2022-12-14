<template lang="html">
  <div class="container">
    <!-- 诊断目录管理功能区，做成卡片的样子 -->
    <el-card class="box-card" shadow="hover">
      <!-- 标题 -->
      <div slot="header" class="clearfix">
        <span style="padding-left: 20px">诊断目录管理</span>
      </div>

      <!-- 表单部分 -->
      <div class="business-region">
        <!-- 表单头部：搜索功能区和添加诊断目录按钮 -->
        <div class="tool-bar">
          <!-- 搜索区 -->
          <div class="search-region">
            <el-input placeholder="搜索内容" v-model="input" class="input-with-select">
              <el-select v-model="chosenOption" slot="prepend" placeholder="通过诊断目录ID搜索" class="select-box">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
          <!-- 添加，批量管理按钮 -->
          <div class="button-group">
            <!-- 添加按钮 -->
            <div>
              <el-button type="primary" @click="refresh">刷新</el-button>
            </div>
            <div>
              <el-button type="primary" @click="addDiseaseDialogVisible = true">新增诊断目录</el-button>
            </div>
            <div>
              <el-button type="primary" @click="export2Excel">导出</el-button>
            </div>
          </div>
        </div>
        <!-- 列表，展示所有诊断目录或搜索到的诊断目录，后面带有修改/删除按钮-->
        <div class="table-region">
          <el-table :data="this.showedDiseases" style="width: 100%">
            <!-- <el-table-column
              type="selection"
              width="55">
            </el-table-column> -->
            <el-table-column label="诊断目录ID" prop="id" width="60"> </el-table-column>
            <el-table-column label="诊断目录编码" prop="code"> </el-table-column>
            <el-table-column label="诊断目录名称" prop="name"> </el-table-column>
            <el-table-column label="ICD编码" prop="icdCode"> </el-table-column>
            <el-table-column label="分类" prop="type"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="currentSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="diseases.length"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog :visible="addDiseaseDialogVisible" width="60%" :before-close="handleClose1">
      <disease-adder>添加诊断目录</disease-adder>
    </el-dialog>
    <el-dialog :visible="editDiseaseDialogVisible" width="60%" :before-close="handleClose2">
      <disease-editor v-model="currentDisease">编辑诊断目录信息</disease-editor>
    </el-dialog>
  </div>
</template>

<script>
import disease from '@/api/basicinfo/disease';
import DiseaseEditor from './Child/DiseaseEditor';
import DiseaseAdder from './Child/DiseaseAdder';

export default {
  name: 'DiseaseAdmin',
  components: {
    'disease-editor': DiseaseEditor,
    'disease-adder': DiseaseAdder,
  },

  data() {
    return {
      input: '',
      addDiseaseDialogVisible: false,
      editDiseaseDialogVisible: false,
      chosenOption: '',
      searchOptions: [
        {
          value: 'diseaseId',
          label: '通过诊断目录ID搜索',
        },
        {
          value: 'diseaseName',
          label: '通过诊断目录名搜索',
        },
      ],

      diseases: [],
      showedDiseases: [],
      currentPage: 1,
      currentSize: 10,
      currentDisease: {},
    };
  },

  methods: {
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../vendor/Export2Excel');
        const tHeader = ['诊断目录ID', '诊断目录编码', '诊断目录名称', 'ICD编码', '分类']; //对应表格输出的title
        const filterVal = ['id', 'code', 'name', 'icdCode', 'type']; // 对应表格输出的数据
        const list = this.diseases;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '诊断目录'); //对应下载文件的名字
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // 搜索
    search() {
      disease
        .getDiseaseById(this.input)
        .then((response) => {
          console.log(response.data.data);
          const data = response.data.data;
          this.showedDiseases = [];
          this.showedDiseases.push(data);
        })
        .catch((error) => {});
    },
    // 新增/修改 诊断目录信息
    handleEdit(index, row) {
      this.currentDisease = row;
      this.editDiseaseDialogVisible = true;
      console.log(this.currentDisease);
    },

    handleDelete(index, row) {
      disease
        .deleteDisease(row.id)
        .then((response) => {
          console.log(response.data);
          const data = response.data.data;

          if (response.data.code === 200) {
            this.success('诊断目录删除');
          } else {
            this.fail('诊断目录删除');
          }
          this.refresh();
        })
        .catch((error) => {});
    },

    // 成功提示
    success(msg) {
      this.$message({
        message: msg + '成功',
        type: 'success',
      });
    },

    // 失败提示
    fail(msg) {
      this.$message.error(msg + '失败');
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentSize = val;
      this.setShowedDiseases();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.setShowedDiseases();
    },
    refresh() {
      disease
        .listAllDiseases()
        .then((response) => {
          console.log(response.data);
          const data = response.data.data;
          this.diseases = data;
          this.setShowedDiseases();
        })
        .catch((error) => {});
    },

    setShowedDiseases() {
      console.log(this.currentPage);
      this.showedDiseases = this.diseases.slice(
        (this.currentPage - 1) * this.currentSize,
        (this.currentPage - 1) * this.currentSize + this.currentSize
      );
    },
    handleClose1() {
      this.addDiseaseDialogVisible = false;
    },
    handleClose2() {
      this.editDiseaseDialogVisible = false;
    },
  },

  mounted() {
    this.refresh();
  },
};
</script>

<style lang="css" scoped>
.business-region {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.tool-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tool-bar div {
  padding-left: 10px;
  padding-right: 10px;
}

.search-region {
  flex-grow: 15;
}

.table-region {
  border: 1px solid #f5f5f5;
  border-radius: 4px;
  margin: 10px 20px;
}

.container {
  padding: 20px;
}

.title p {
  font-size: 20px;
}

.button-group {
  flex-basis: 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.avatar {
  border: 1px solid #91d5ff;
  width: 120px;
  height: 120px;
}

.select-box {
  width: 140px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
