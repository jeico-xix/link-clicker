import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import http from './plugins/http'
import manager from './plugins/manager'
import _ from 'lodash'

Vue.prototype.$_ = _

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  manager,
  http,
  render: h => h(App)
}).$mount('#app')