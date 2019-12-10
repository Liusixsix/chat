import Vue from 'vue'
import App from './App.vue'
import router from './router.js'   
import '@/assets/style/reset.css'
import '@/utils/rem'
import './vant.js'
import VConsole from 'VConsole'
import '@/utils/inobounce.min'
// import '@/utils/directive'
// import '@/Hammer.js'
// import { tap,swipeleft,swiperight,press } from '@/utils/directive'
import vTouch from 'any-touch/dist/v-touch.common'
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)
import VueClipboard from 'vue-clipboard2'
// import '@/utils/exif.js'
Vue.use(VueClipboard)
Vue.use(vTouch);
Vue.config.productionTip = false
var vConsole = new VConsole();
// console.log('Hello world');
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
