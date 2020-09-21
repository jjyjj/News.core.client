/*
这里是直接更新state的多个方法
*/
//引入变量
import {

    RECEIVE_CATEGORYS,
    RECEIVE_USERINFO,
    RECEIVE_ARTICLES
} from "./mutation-types";

export default {
    [RECEIVE_CATEGORYS](state, { cates }) {
        state.categorysList = cates

    },
    [RECEIVE_ARTICLES](state, { list }) {
        state.articlesList = list
    },


    [RECEIVE_USERINFO](state, { userInfo }) {
        state.userInfo = userInfo
    },
}