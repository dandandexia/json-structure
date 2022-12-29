
## 适用于vue2的json结构化录入组件

### 使用

```
// 安装依赖
npm install vue-json-structure

// vue中引入
import vueJsonStructure from 'vue-json-structure'

Vue.use(vueJsonStructure);
```

### 组件依赖
为了体验更好，组件使用了TDesign组件库，如需使用，请在主项目中引入TDesign

### 实现效果
![Alt](https://github.com/dandandexia/json-structure/blob/master/src/assets/result.png)

### 数据结构
![Alt](https://github.com/dandandexia/json-structure/blob/master/src/assets/json.png)

### 参数
|  参数名   | 说明  |
|  ----  | ----  |
| jsonData  | 基础数据，为一个对象 |
| disabled  | 是否可编辑 |
| change  | (data, index) => {}, data中removeSelf若为true，为删除当前数据 |