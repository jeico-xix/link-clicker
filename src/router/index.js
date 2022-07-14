import Vue from 'vue'
// import store from '../store/index'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView'
import SiteView from '../views/SiteView'
import LogView from '../views/LogView'
import SettingView from '../views/SettingView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    redirect: '/login',
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/sites',
    name: 'sites',
    component: SiteView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/logs',
    name: 'logs',
    component: LogView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingView,
    meta: {
      requiresAuth: false
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach(next => {
//   // if (to.name !== 'login' && !store.state.authenticated) next({ name: 'login' })
//   // else next()
//   next()
// })

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
