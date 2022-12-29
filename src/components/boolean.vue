<template>
  <div :class="{ 'is-child': isChild }">
    <t-form
      :data="data"
      ref="form"
      layout="inline"
      :rules="rules"
      label-width="0"
      :disabled="disabled"
    >
      <t-form-item name="name">
        <t-input v-model="data.name" placeholder="字段名（中文）"></t-input>
      </t-form-item>
      <t-form-item name="isRetrieval">
        <div title="若为检索字段则需要勾选">
          <t-checkbox v-model="data.isRetrieval" :value="true" />
        </div>
      </t-form-item>
      <t-form-item name="enName">
        <t-input v-model="data.enName" placeholder="字段ID"></t-input>
      </t-form-item>
      <t-form-item name="dataType">
        <t-select
          v-model="data.dataType"
          :options="dataType"
          :disabled="disabled"
          placeholder="字段类型"
        ></t-select>
      </t-form-item>
      <!-- <t-form-item name="unit">
        <t-input v-model="formData.unit" placeholder="单位"></t-input>
      </t-form-item> -->
      <t-form-item name="remark">
        <t-input v-model="data.remark" placeholder="备注"></t-input>
      </t-form-item>
      <t-form-item v-if="!disabled">
        <t-button variant="dashed" title="配置" @click="showConfig = true"
          ><t-icon name="setting"></t-icon
        ></t-button>
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
    <t-dialog
      header="布尔值配置"
      :visible="showConfig"
      @confirm="setConfig"
      @cancel="showConfig = false"
      @close="showConfig = false"
    >
      <t-form layout="inline" labelAlign="top">
        <t-form-item label="code">
          <div class="inline-item">
            <t-input
              v-for="(item, index) in metaData"
              :key="index"
              :value="item.code"
              disabled
            ></t-input>
          </div>
        </t-form-item>
        <t-form-item label="desc">
          <div class="inline-item">
            <t-input
              v-for="(item, index) in metaData"
              :key="index"
              v-model="item.desc"
              placeholder="请输入描述"
              :disabled="disabled"
            ></t-input>
          </div>
        </t-form-item>
      </t-form>
    </t-dialog>
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
  name: 'boolean',
  props: {
    disabled: Boolean,
    formData: Object,
    isChild: {
      default: false
    }
  },
  data() {
    return {
      showConfig: false,
      dataType,
      data: Object.assign({}, this.formData),
      metaData: this.formData.metaData.length ? this.formData.metaData : [
        { code: true, desc: '' },
        { code: false, desc: '' }
      ],
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
        console.log(newVal);
        this.$emit('change', newVal);
      }
    }
  },
  methods: {
    setConfig() {
      this.data.metaData = [
        ...this.metaData
      ];
      this.showConfig = false;
    },
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
<style lang="less" scoped>
.inline-item {
  /deep/ .t-input {
    margin-bottom: 10px;
  }
}
</style>
