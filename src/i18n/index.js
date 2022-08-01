import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhCNLocale from './lang/zh-CN';
import enLocale from './lang/en';
import store from '@/store';
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

console.log(store.getters['user/lang'], '当前语言======');
const i18n = new VueI18n({
  locale: store.getters['user/lang'], // 语言,
  messages: message,
});

locale.i18n((key, value) => i18n.t(key, value)); //为了实现element插件的多语言切换

export default i18n;
