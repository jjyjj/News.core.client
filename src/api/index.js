/*
包含n个接口请求函数的模块
函数的返回值: promise对象
默认是get请求，其余的话传参
 */
import ajax from './ajax'
// const BASE_URL = 'http://localhost:4000'
const BASE_URL = 'http://localhost:8510'


// 1、获取分类列表
export const reqArticleCategorys = () => ajax(BASE_URL + '/Category/getAll')
    // 2、获取文章列表
export const reqArticles = (queryModel) => ajax(BASE_URL + '/News/GetAll', queryModel)
    // 6、用户名密码登陆
export const reqPwdLogin = ({ name, pwd }) => ajax(BASE_URL + '/login/login', { name, pwd }, 'post')

// 10、用户登出
export const reqLogout = () => ajax(BASE_URL + '/logout')