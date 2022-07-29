import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhCNLocale from './lang/zh-CN';
import enLocale from './lang/en';

/*element ui国际化*/
import locale from 'element-ui/lib/locale';
Vue.use(VueI18n);

const message = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhCNLocale,
  },
};

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'zh', // 语言,
  messages: message,
});

locale.i18n((key, value) => i18n.t(key, value)); //为了实现element插件的多语言切换

export default i18n;
