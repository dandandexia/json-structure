import JsonStructure from './src/index.vue'

const comment = {
  install: function (Vue, opts = {}) {
    Vue.component(JsonStructure.name, JsonStructure);
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment)
}

export default comment;

