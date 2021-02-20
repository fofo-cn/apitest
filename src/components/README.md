# form 组件

| 参数    | 是否必选 | 说明             | 类型            | 可选 | 默认 |
| ------- | -------- | ---------------- | --------------- | ---- | ---- |
| data    | 是       | 表单的 JSON 配置 | `Array<object>` |      |      |
| columns | 否       | 表单分割数量     | `Number`        |      | 24   |

```html
<template>
  <hbn-form :data="form"></hbn-form>
</template>
<script>
  import hbnForm from "components/form/hbnForm.vue";
  export default Vue.extend({
    components: {
      hbnForm
    },
    data() {
      return {
        form: {} //看下文
      };
    }
  });
</script>
```

## form.data

| 参数        | 是否必选 | 说明                 | 类型                      | 可选                                                                                        | 默认 |
| ----------- | -------- | -------------------- | ------------------------- | ------------------------------------------------------------------------------------------- | ---- |
| value       | 是       | 传递的值             | `string | number | array` | 无                                                                                          | 无   |
| type        | 是       | 表单元素的类型       | `string`                  | `[select, multiple_select, input, multiple_input, switch, radio, checkbox, textarea, rich]` | 无   |
| column_span | 否       | 表单元素横向几个格子 | `number`                  | 1-24，最好是 24 约数                                                                        | 24   |
| lable       | 是       | 左侧文字             | `string`                  | 无                                                                                          | 无   |
| option      | 否       | 表单内相关参数       | `object`                  | 无                                                                                          | 无   |

```js
form:{
  BmTypeValue: {
    value: null,
    label: "类型",
    column_span: 6,
    type: "select",
    option: {}//看各个type的下文
  }
}
```

## select 和 multiple_select

### select.option

| 参数         | 是否必选 | 说明                                                             | 类型            | 可选                                    | 默认    |
| ------------ | -------- | ---------------------------------------------------------------- | --------------- | --------------------------------------- | ------- |
| data         | 是       | 驱动数据                                                         | `Array<object>` | 无                                      | 无      |
| multiple     | 否       | 是否多选，多选时，[select_value]的值应当是2的n次幂                                                         | `boolean`       | `true | false`                          | `false` |
| label_for_0  | 否       | 0 值的 label                                                     | `string`        | `请选择`、`全部`或其他                  | 无      |
| select_value | 否       | data 里的 value 的键名，当 multiple 为 true 时，锁死为`BinaryId` | `string`        | `Id`、`BinaryId`、`value`或其他`string` | `Id`    |
| select_label | 否       | data 里的 label 的键名                                           | `string`        | `Name`、`text`或其他`string`            | `Name`  |

```js
BmTypeValue: {
  value: null,
  label: "类型",
  column_span: 6,
  type: "select",
  option: {
    data:[],//看select.option.data
    multiple:false,//单选
    label_for_0:'请选择',
    select_value:'testId',
    select_label:'testLabel'
  }
}
```

### select.option.data

| 参数           | 是否必选 | 说明                        | 类型              | 可选           | 默认            |
| -------------- | -------- | --------------------------- | ----------------- | -------------- | --------------- |
| [select_value] | 是       | select 里各个选项的值       | `number | string` | 无             | 键名为 Id       |
| [select_label] | 是       | select 里各个选项的展示文字 | `string`          | 无             | 键名为 Name     |
| disabled       | 否       | 选项是否被禁止              | `boolean`         | `true | false` | 没有就是`false` |

```js
data:[
  {testId:1,select_label:'测试1'},
  {testId:2,select_label:'测试2',disabled:true},
  {testId:3,select_label:'测试3'},
]
```

### multiple_select 的 value 是个对象

| 参数  | 是否必选 | 说明         | 类型              | 可选 | 默认 |
| ----- | -------- | ------------ | ----------------- | ---- | ---- |
| [key] | 是       | 多级下拉的值 | `number | string` | 无   | 无   |
```js
City:{
  value:{
    area1:null,
    area2:null,
    area3:null
  }
}
```

### multiple_select.option

| 参数  | 是否必选 | 说明                  | 类型            | 可选 | 默认 |
| ----- | -------- | --------------------- | --------------- | ---- | ---- |
| [key] | 是       | 每个多级下拉的 option | `select.option` | 无   | 无   |
```js
City:{
  option:{
    area1:{
      data:[],
      label_for_0:'请选择省',
    },
    area2:{
      data:[],
      label_for_0:'请选择市',
    },
    area3:{
      data:[],
      label_for_0:'请选择县',
    }
  }
}
```
> multiple_select 的 value 和 option 的 key 要对应，且该 key 为字段名

## input 和 multiple_input

### input.option

| 参数        | 是否必选 | 说明     | 类型      | 可选           | 默认            |
| ----------- | -------- | -------- | --------- | -------------- | --------------- |
| disabled    | 否       | 是否禁止 | `boolean` | `true | false` | 没有就是`false` |
| placeholder | 否       | 占位文字 | `string`  | 无             | `请输入`        |

```js
Name:{
  option:{
    disabled:false,
    placeholder:'请输入你的名字'
  }
}
```
### multiple_input 的 value 是个对象

| 参数  | 是否必选 | 说明           | 类型              | 可选 | 默认 |
| ----- | -------- | -------------- | ----------------- | ---- | ---- |
| [key] | 是       | 多级输入框的值 | `number | string` | 无   | 无   |

```js
Salary:{
  value:{
    SalaryStart:null,
    SalaryEnd:null
  }
}
```
### multiple_input.option

| 参数  | 是否必选 | 说明                    | 类型           | 可选 | 默认 |
| ----- | -------- | ----------------------- | -------------- | ---- | ---- |
| [key] | 是       | 每个多级输入框的 option | `input.option` | 无   | 无   |
```js
Salary:{
  option:{
    SalaryStart:{
      placeholder:'请输入最低工资'
    },
    SalaryEnd:{
      placeholder:'请输入最高工资'
    }
  }
}
```
> multiple_input 和 option 的 key 要对应，且该 key 为字段名

## switch

### switch.option

| 参数     | 是否必选 | 说明     | 类型      | 可选           | 默认            |
| -------- | -------- | -------- | --------- | -------------- | --------------- |
| disabled | 否       | 是否禁止 | `boolean` | `true | false` | 没有就是`false` |

```js
show:{
  option:{
    disabled:false
  }
}
```
## radio

### radio.option

| 参数        | 是否必选 | 说明                   | 类型            | 可选                                    | 默认    |
| ----------- | -------- | ---------------------- | --------------- | --------------------------------------- | ------- |
| data        | 是       | 驱动数据               | `Array<object>` | 无                                      | 无      |
| radio_value | 否       | data 里的 value 的键名 | `string`        | `Id`、`BinaryId`、`value`或其他`string` | `Id`    |
| radio_label | 否       | data 里的 label 的键名 | `string`        | `Name`、`text`或其他`string`            | `Name`  |
| card        | 否       | 改用 radio-button      | `boolean`       | `true|false`                            | `false` |
```js
type:{
  option:{
    data:[],
    radio_value:'testId',
    radio_label:'testLabel',
    card:true
  }
}
```
### radio.option.data

| 参数          | 是否必选 | 说明                       | 类型              | 可选           | 默认            |
| ------------- | -------- | -------------------------- | ----------------- | -------------- | --------------- |
| [radio_value] | 是       | radio 里各个选项的值       | `number | string` | 无             | 键名为 Id       |
| [radio_label] | 是       | radio 里各个选项的展示文字 | `string`          | 无             | 键名为 Name     |
| disabled      | 否       | 选项是否被禁止             | `boolean`         | `true | false` | 没有就是`false` |
```js
data:[
  {testId:1,testLabel:'选项1'},
  {testId:2,testLabel:'选项2'},
  {testId:3,testLabel:'选项3'},
]
```
## checkbox

### checkbox.option

| 参数           | 是否必选 | 说明                   | 类型            | 可选                         | 默认    |
| -------------- | -------- | ---------------------- | --------------- | ---------------------------- | ------- |
| data           | 是       | 驱动数据               | `Array<object>` | 无                           | 无      |
| checkbox_label | 否       | data 里的 label 的键名 | `string`        | `Name`、`text`或其他`string` | `Name`  |
| card           | 否       | 改用 checkbox-button   | `boolean`       | `true|false`                 | `false` |
```js
type:{
  option:{
    data:[],
    checkbox_label:'testLabel',
    card:true
  }
}
```
### checkbox.option.data

| 参数             | 是否必选 | 说明                          | 类型              | 可选           | 默认            |
| ---------------- | -------- | ----------------------------- | ----------------- | -------------- | --------------- |
| BinaryId         | 是       | checkbox 里各个选项的值,每个值都应当是2的n次幂       | `number | string` | 无             | 无              |
| [checkbox_label] | 是       | checkbox 里各个选项的展示文字 | `string`          | 无             | 键名为 Name     |
| disabled         | 否       | 选项是否被禁止                | `boolean`         | `true | false` | 没有就是`false` |
```js
data:[
  {BinaryId:1,testLabel:'选项1'},
  {BinaryId:2,testLabel:'选项2'},
  {BinaryId:4,testLabel:'选项3'},
]
```
## textarea

### textarea.option

| 参数        | 是否必选 | 说明     | 类型      | 可选           | 默认            |
| ----------- | -------- | -------- | --------- | -------------- | --------------- |
| disabled    | 否       | 是否禁止 | `boolean` | `true | false` | 没有就是`false` |
| placeholder | 否       | 占位文字 | `string`  | 无             | `请输入`        |
| max         | 否       | 最大长度 | `number`  | 无             | `100`           |
```js
adress: {
   value: null,
   label: "地址",
   type: "textarea",
   column_span: 24,
   option: {
     placeholder:'请输入地址'
     max: 140
   }
 }
```
## rich

| 参数        | 是否必选 | 说明     | 类型     | 可选 | 默认     |
| ----------- | -------- | -------- | -------- | ---- | -------- |
| placeholder | 否       | 占位文字 | `string` | 无   | `请输入` |
```js
intro: {
   value: null,
   label: "描述",
   type: "textarea",
   column_span: 24,
   option: {
     placeholder:'请输入地址'
   }
 }
```