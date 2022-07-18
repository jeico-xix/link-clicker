import Axios from 'axios';
import router from '../router'

Axios.defaults.baseURL = process.env.VUE_APP_API_URL;
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

    router.push('/login').catch(err => {
      console.log(err)
    })
  }
  return Promise.reject(error);
});

export default {
  install(Vue) {
    Vue.prototype.$http = Axios
  }
}