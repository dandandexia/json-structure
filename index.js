import Vue from 'vue';
import TDesign from 'tdesign-vue';
import JsonStructure from './src/index.vue'

Vue.use(TDesign);

const install = function (Vue, opts = {}) {
  Vue.component('JsonStructure', JsonStructure);
}

export default {
  install
};

