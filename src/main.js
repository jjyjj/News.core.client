import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
import store from './store'
import './plugins/element.js'

import './assets/css/base.css'
import './assets/layui/css/layui.css'
import animated from 'animate.css'
//引入颜色选择器
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

//全局设置cookie
import { setCookie, getCookie, delCookie } from './assets/cookie.js'
//引入并配置axios
import axios from 'axios'


import moment from 'moment';
// 中文简体
moment.locale('zh-cn');
Vue.use(animated)

Vue.prototype.$moment = moment;
axios.defaults.baseURL = 'http://localhost:8510/'

//通过axios请求拦截器添加token，
//为每一个发起请求添加一个字段验证
axios.interceptors.request.use(config => {

    config.headers.Authorization = "Bearer " +
        window.sessionStorage.getItem('token')
    return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false

//全局设置cookie
Vue.prototype.$cookieStore = {
        setCookie,
        getCookie,
        delCookie
    }
    //字符串过滤器
Vue.filter('strFilter', function(value, strLength) {
        if (!value) return ''

        value = value.toString()
        if (value.length <= strLength) return value
        else {
            return value = value.substring(0, strLength) + "..."
        }
    })
    //日期过滤器
Vue.filter('dateFilter', function(value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(formatString); // value可以是普通日期 20170723

});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')