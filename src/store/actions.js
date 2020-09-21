import {
    reqArticleCategorys,
    reqArticles
} from "../api";

import {
    RECEIVE_ARTICLES,
    RECEIVE_CATEGORYS,
} from "./mutation-types";

export default {
    //异步获取文章分类
    async getCategorys({ commit }) {
        const { data: res } = await reqArticleCategorys()
        if (res.code != 200) return;
        const cates = res.data
        commit(RECEIVE_CATEGORYS, { cates })
    },

    //异步获取文章列表
    async getArticles({ commit }, queryModel) {
        const { data: res } = await reqArticles(queryModel)
        if (res.code != 200) return;
        const list = res.data
        console.table(res.data)
        commit(RECEIVE_ARTICLES, { list })
    },


}