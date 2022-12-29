<template>
  <div>
    <component
      :is="dataType"
      class="json-schema-form"
      ref="schema"
      :formData="formData"
      :disabled="disabled"
      :deep="1"
      @change="changeData"
    ></component>
  </div>
</template>
<script>
import string from './components/string.vue';
import int from './components/int.vue';
import float from './components/float.vue';
import array from './components/array.vue';
import struct from './components/struct.vue';
import boolean from './components/boolean.vue';
import enumType from './components/enum.vue';

const formatJson = {
  name: '',
  enName: '',
  dataType: 'string',
  isRetrieval: false,
  unit: '',
  remark: '',
  metaData: [],
  childEventItems: []
};

export default {
  name: 'vueJsonStructure',
  props: {
    jsonData: Object,
    disabled: Boolean
  },
  components: {
    string,
    int,
    float,
    array,
    struct,
    boolean,
    enumType
  },
  data() {
    return {
      formData: Object.assign({}, formatJson, this.jsonData)
    };
  },
  computed: {
    dataType() {
      return this.formData.dataType === 'enum' ? 'enumType' : this.formData.dataType;
    }
  },
  methods: {
    changeData(data) {
      this.formData = {
        ...data
      };
    },
    async validate() {
      const result = await this.$refs.schema.validate();
      return result;
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(newVal) {
        this.$emit('change', newVal);
      }
    },
    dataType() {
      this.formData.metaData = [];
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .t-input__extra {
  position: static;
  color: var(--td-error-color) !important;
}
.json-schema-form {
  display: block;
  /deep/ .is-child {
    margin-left: 20px;
  }

  /deep/ .t-form {
    padding-bottom: 5px;
  }
  /deep/ .t-input {
    width: 160px !important;
  }
  /deep/ .t-form__item {
    min-width: auto;
    margin-right: 12px;
  }
  /deep/ .t-checkbox__label {
    margin-right: 0;
  }
  /deep/ .t-button--variant-dashed {
    padding: 0 10px;
  }
  .is-child {
    margin-left: 20px;
  }
}
</style>
