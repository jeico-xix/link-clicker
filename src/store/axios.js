import Axios from 'axios'

Axios.defaults.baseURL = 'http://127.0.0.1:4002';
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

    // if (!_.isEqual(router)) {
    //   router.replace('/login');
    // }
  }
  return Promise.reject(error);
});

export default Axios