import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import '@/assets/style/reset.css'
import '@/utils/rem'
import './vant.js'
import '@/utils/inobounce.min'
// import '@/utils/directive'
import vTouch from 'any-touch/dist/v-touch.common'
Vue.use(vTouch);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
