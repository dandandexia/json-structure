<template>
  <div :class="{ 'is-child': isChild }" class="struct-warpper">
    <t-icon
      :name="iconName"
      class="icon"
      style="cursor: pointer"
      @click="toggle"
    ></t-icon>
    <t-form
      :data="data"
      layout="inline"
      ref="form"
      :rules="rules"
      label-width="0"
      :disabled="disabled"
    >
      <t-form-item name="name">
        <t-input v-model="data.name" placeholder="字段名（中文）"></t-input>
      </t-form-item>
      <t-form-item name="isRetrieval">
        <div title="若为检索字段则需要勾选">
          <t-checkbox v-model="formData.isRetrieval" :value="true" />
        </div>
      </t-form-item>
      <t-form-item name="enName">
        <t-input v-model="data.enName" placeholder="字段ID"></t-input>
      </t-form-item>
      <t-form-item name="dataType">
        <t-select
          v-model="data.dataType"
          :options="dataType"
          placeholder="字段类型"
          :disabled="disabled"
        ></t-select>
      </t-form-item>
      <t-form-item name="remark">
        <t-input v-model="data.remark" placeholder="备注"></t-input>
      </t-form-item>
      <t-form-item v-if="!disabled">
        <t-button
          variant="dashed"
          v-if="deep <= 3"
          title="添加子节点"
          @click="addChild"
          ><t-icon name="add"></t-icon
        ></t-button>
        <t-button
          variant="dashed"
          v-if="isChild"
          title="删除子节点"
          @click="removeChild"
          ><t-icon name="remove"></t-icon
        ></t-button>
        <t-button
          variant="dashed"
          v-else
          title="删除当前节点"
          @click="removeData"
          ><t-icon name="remove"></t-icon
        ></t-button>
      </t-form-item>
    </t-form>
    <component
      v-for="(item, index) in data.childEventItems"
      v-show="showChild"
      :key="index"
      :is="getDataType(item.dataType)"
      :ref="`schema_${index}`"
      :deep="deep + 1"
      :isChild="true"
      :disabled="disabled"
      :formData="data.childEventItems[index]"
      @change="(data) => changeData(index, data)"
    ></component>
  </div>
</template>
<script>
import string from './string.vue';
import int from './int.vue';
import float from './float.vue';
import array from './array.vue';
// import struct from './array.vue';
import boolean from './boolean.vue';
import enumType from './enum.vue';
import { dataType } from '../constants';

// console.log(struct);

const formatJson = {
  name: '',
  enName: '',
  isRetrieval: false,
  dataType: 'string',
  unit: '',
  metaData: [],
  childEventItems: []
};

export default {
  name: 'array',
  components: {
    string,
    int,
    float,
    array,
    // struct,
    boolean,
    enumType
  },
  props: {
    deep: Number,
    disabled: Boolean,
    formData: Object,
    isChild: {
      default: false
    }
  },
  computed: {
    iconName() {
      return this.showChild ? 'caret-down-small' : 'caret-right-small';
    }
  },
  data() {
    return {
      showChild: true,
      dataType,
      data: JSON.parse(JSON.stringify({
        ...formatJson,
        ...this.formData
      })),
      rules: {
        name: [
          { required: true, message: '请输入字段名（中文）' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '仅支持中文' },
          { max: 50, message: '字符长度限制1-50' }
        ],
        enName: [
          { required: true, message: '请输入字段ID' },
          { pattern: /^[a-zA-Z]+$/, message: '仅支持英文' },
          { max: 50, message: '字符长度限制1-50' }
        ],
        unit: [
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '仅支持中英文' },
          { max: 50, message: '最多不能超过50个字' }
        ],
        remark: [
          { max: 99, message: '最多不能超过99个字' }
        ]
      }
    };
  },
  methods: {
    toggle() {
      this.showChild = !this.showChild;
    },
    removeData() {
      // 在data上做删除标记，上层节点进行删除
      this.$emit('change', {
        ...this.data,
        removeSelf: true
      });
    },
    getDataType(type) {
      if (type === 'struct') return 'array';
      return type === 'enum' ? 'enumType' : type;
    },
    addChild() {
      this.data.childEventItems.push({
        ...formatJson
      });
    },
    removeChild() {
      this.$emit('change', {
        ...this.data,
        removeSelf: true
      });
    },
    changeData(index, data) {
      if (data.removeSelf) {
        this.data.childEventItems.splice(index, 1);
      } else {
        this.data.childEventItems[index] = {
          ...data
        };
      }
    },
    async validate() {
      let result = await this.$refs.form.validate();
      if (result !== true) return result;
      await new Promise((resolve) => {
        if (this.data.childEventItems.length) {
          this.data.childEventItems.forEach((item, index) => {
            const subResult = this.$refs[`schema_${index}`][0].validate();
            if (subResult !== true) {
              result = subResult;
            }
            if (index === this.data.childEventItems.length - 1) {
              resolve();
            }
          });
        }
      });
      return result;
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newVal) {
        this.$emit('change', newVal);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.struct-warpper {
  position: relative;
  .icon {
    position: absolute;
    left: -17px;
    top: 10px;
  }
}
</style>
