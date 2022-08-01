<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <img src="@/assets/language.svg" class="img" :style="{ background: bg }" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh"> 中文 </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en"> English </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  name: 'LangSelect',
  props: {
    bg: {
      type: String,
    },
  },
  data() {
    return {
      language: localStorage.getItem('lang') || 'en',
    };
  },
  methods: {
    handleSetLanguage(val) {
      this.$store.dispatch('user/setLang', val);
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.img {
  width: 25px;
  height: 25px;
}
</style>
