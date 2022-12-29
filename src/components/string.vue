<template>
  <div :class="{ 'is-child': isChild }">
    <t-form
      :data="formData"
      ref="form"
      layout="inline"
      :rules="rules"
      label-width="0"
      :disabled="disabled"
    >
      <t-form-item name="name">
        <t-input v-model="formData.name" placeholder="字段名（中文）"></t-input>
      </t-form-item>
      <t-form-item name="isRetrieval">
        <div title="若为检索字段则需要勾选">
          <t-checkbox v-model="formData.isRetrieval" :value="true" />
        </div>
      </t-form-item>
      <t-form-item name="enName">
        <t-input v-model="formData.enName" placeholder="字段ID"></t-input>
      </t-form-item>
      <t-form-item name="dataType">
        <t-select
          v-model="formData.dataType"
          :options="dataType"
          placeholder="字段类型"
          :disabled="disabled"
        ></t-select>
      </t-form-item>
      <t-form-item name="unit">
        <t-input v-model="formData.unit" placeholder="单位"></t-input>
      </t-form-item>
      <t-form-item name="remark">
        <t-input v-model="formData.remark" placeholder="备注"></t-input>
      </t-form-item>
      <t-form-item v-if="!disabled">
        <t-button
          variant="dashed"
          v-if="isChild"
          title="删除子节点"
          @click="removeData"
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
  </div>
</template>
<script>
import { dataType } from '../constants';

// formData: {
//   name: '',
//   enName: '',
//   dataType: '',
// },

export default {
  name: 'string',
  props: {
    formData: Object,
    disabled: Boolean,
    isChild: {
      default: false
    }
  },
  data() {
    return {
      dataType,
      data: Object.assign({}, this.formData),
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
  watch: {
    data: {
      deep: true,
      handler(newVal) {
        this.$emit('change', newVal);
      }
    }
  },
  methods: {
    removeData() {
      // 在data上做删除标记，上层节点进行删除
      this.$emit('change', {
        ...this.data,
        removeSelf: true
      });
    },
    async validate() {
      const result = await this.$refs.form.validate();
      return result;
    }
  }
};
</script>
