import { Manager } from 'socket.io-client'

const manager = new Manager(process.env.VUE_APP_SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'] 
});

export const logs = manager.socket('/logs')