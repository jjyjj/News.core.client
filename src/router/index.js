import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import NewsDetails from '../views/NewsDetails.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Forget from '../views/Forget.vue'
import Profile from '../views/Profile.vue'
import AddArticle from '../views/AddArticle.vue'
import EditArticle from '../views/EditArticle.vue'
import Comment from '../views/Comment.vue'
import MyArticles from '../views/MyArticles.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/newsDetails',
        component: NewsDetails
    }, {
        path: '/login',
        component: Login
    }, {
        path: '/forget',
        component: Forget
    }, {
        path: '/profile',
        component: Profile
    }, {
        path: '/register',
        component: Register
    },
    {
        path: '/addArticle',
        component: AddArticle
    },
    {
        path: '/comment',
        component: Comment
    },
    {
        path: '/editArticle',
        component: EditArticle
    },
    {
        path: '/myArticles',
        component: MyArticles
    }
]

const router = new VueRouter({
    routes
})

export default router