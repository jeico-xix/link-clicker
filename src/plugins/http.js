import Vue from 'vue';
import * as http from 'axios';
import router from '../router';

http.defaults.baseURL = process.env.VUE_APP_API_URL;
const token = localStorage.getItem('token')
http.defaults.headers.common = { 'Authorization': `bearer ${token}` }

// Add a response interceptor
http.interceptors.response.use(function (response) {
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

    if (!Vue._.isEqual(router)) {
      router.replace('/login');
    }
  }
  return Promise.reject(error);
});

Vue.prototype.$http = http
export default http