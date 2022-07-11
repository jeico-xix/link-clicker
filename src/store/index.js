import Vue from 'vue'
import Vuex from 'vuex'
import logs from './modules/logs'

Vue.use(Vuex);

const store = new Vuex.Store(
  {
    state: {
      authenticated: false
    },
    mutations: {
      setAuthentication(state, status) {
        state.authenticated = status;
      }
    },
    modules: {
      logs
    }
  }
)

export default store