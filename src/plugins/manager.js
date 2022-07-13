import Vue from 'vue';
import { Manager } from 'socket.io-client'

const manager = new Manager(process.env.VUE_APP_SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'] 
});

Vue.prototype.$manager = manager;
export default manager