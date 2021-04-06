import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* В данном ТЗ можно обойтись и без Vuex, но для вида все-таки прописал парочку функций
actions: {
  fetcher({commit, state}, url) {
    commit('setLoading', true);
    fetch(url, {cache: 'no-cache'})
      .then(i => i.json())
      .then(r => commit('setResult', r))
      .catch((err) => commit('setError', err.message))
      .finally(() => commit('setLoading', false))
  }
} */

export default new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
  },
  getters: {
    getLoading(state) {
      return state.loading
    }
  }
})
