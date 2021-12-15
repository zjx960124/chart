import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import draw from './modules/draw'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    draw
  },
  getters
});

export default store
