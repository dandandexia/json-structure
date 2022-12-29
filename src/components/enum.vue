<template>
  <div :class="{ 'is-child': isChild }">
    <t-form
      :data="data"
      layout="inline"
      label-width="0"
      :rules="rules"
      ref="form"
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
          :disabled="disabled"
          :options="dataType"
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
          ><t-icon name="setting"></t-icon></t-button
        ><t-button
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
          ><t-icon name="remove"></t-icon></t-button
      ></t-form-item>
    </t-form>
    <t-dialog
      header="枚举配置"
      :visible="showConfig"
      @confirm="setConfig"
      @cancel="showConfig = false"
      @close="showConfig = false"
      width="550px"
    >
      <t-form layout="inline" labelAlign="top">
        <t-form-item label="code">
          <div class="inline-item">
            <t-input
              v-for="(item, index) in metaData"
              :key="index"
              v-model="item.code"
              :disabled="disabled"
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
        <t-form-item>
          <div class="inline-item" style="margin-top: 32px">
            <div class="operate" v-for="(item, index) in metaData" :key="index">
              <t-button variant="dashed" @click="addCode(index)"
                ><t-icon name="add"></t-icon
              ></t-button>
              <t-button variant="dashed" @click="removeCode(index)"
                ><t-icon name="remove"></t-icon
              ></t-button>
            </div>
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
  name: 'enum',
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
        { code: '', desc: '' }
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
    addCode(index) {
      this.metaData.splice(index + 1, 0, {
        code: '',
        desc: ''
      });
    },
    removeCode(index) {
      this.metaData.splice(index, 1);
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
    },
  }
};
</script>
<style lang="less" scoped>
.inline-item {
  /deep/ .t-input,
  .operate {
    margin-bottom: 10px;
  }
}
</style>
