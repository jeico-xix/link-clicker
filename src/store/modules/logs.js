/* eslint no-shadow: ["error", { "allow": ["state"] }]*/
import http from '../../plugins/http';

const state = {
  logs: [

  ]
};

const getters = {
  allLogs: state => state.logs
};

const actions = {
  async fetchLogs({ commit }) {
    const response = await http.get('/sites');
    commit('setLogs', response.data.list);
  }
}

const mutations = {
  setLogs: (state, logs) => (state.logs = logs)
};

export default {
  state,
  getters,
  actions,
  mutations
}