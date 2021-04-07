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
    loading: false,
    cache: new Map(),
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
    setCache(state, [requestKey, objects]) {
      state.cache.set(requestKey, objects)
    }
  },
  actions: {
  },
  getters: {
    getLoading(state) {
      return state.loading
    },
    getFromCache(state) {
      return state.cache
    }
  }
})
