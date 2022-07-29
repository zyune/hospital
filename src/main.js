import Vue from 'vue';
import App from './App';
import router from './router/index';
import store from './store';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Print from 'vue-print-nb';
import echarts from 'echarts';

Vue.config.productionTip = false;

Vue.use(ElementUI, {
  size: 'small',
  zIndex: 3000,
});
Vue.use(Print);
Vue.prototype.$echarts = echarts;

Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
