import Vue from 'vue'
import Router from 'vue-router'
import Main from './components/Main.vue'
Vue.use(Router)
const router = new Router({
    routes:[
        {
            path:'/',
            name:'app',
            component:Main
        }
    ]
})

export default router;