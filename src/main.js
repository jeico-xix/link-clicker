import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import Axios from 'axios'
import io from 'socket.io-client'
import _ from 'lodash'

Vue.prototype.$io = io
Axios.defaults.baseURL = 'http://api-clicker.go-wi.com';
const token = localStorage.getItem('token')
Axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

// Add a response interceptor
Axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const status = error.response.status
  if (status === 401) {
    localStorage.setItem('is_logged_in', false)
    const key = 'is_dark_mode'
    const isDarkMode = localStorage.getItem(key);
    localStorage.clear();
    localStorage.setItem(key, isDarkMode);

    if (!_.isEqual(router)) {
      router.replace('/login');
    }
  }
  return Promise.reject(error);
});

Vue.prototype.$http = Axios;

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')