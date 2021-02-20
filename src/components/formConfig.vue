<template>
  <div>
    <div class="fixed-button">
      <el-button-group>
        <el-button type="primary" @click="create">快速创建</el-button>
        <el-button type="primary" @click="add(0)">添加</el-button>
        <el-button type="primary" @click="formJson">生成JSON</el-button>
        <el-button type="danger" @click="data=[]">清空</el-button>
      </el-button-group>
    </div>
    <ul class="form-config">
      <li>
        <el-input type="textarea" v-model="keys" placeholder="用,隔开"></el-input>
        <vuedraggable v-model="data" class="drag-wrap">
          <p v-for="(item,index) in data" :key="index">
            <span @click="item.show = !item.show" class="show-btn" :class="{active:item.show}"></span>
            {{index+1}}-{{hash[item.type]}}-{{item.label}}
          </p>
        </vuedraggable>
      </li>
      <li v-for="(item,index) in data" :key="index" v-show="item.show">
        <el-form class="form-info" inline>
          <el-form-item label="类型">
            <el-select v-model="item.type" @change="onChangeType(item)">
              <el-option v-for="(label,type) in hash" :key="type" :value="type" :label="label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段">
            <el-input v-model="item.key" />
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="item.label" />
          </el-form-item>
          <el-form-item label="栅格">
            <el-input v-model="item.column_span" type="number" />
          </el-form-item>
          <el-form-item>
            <div>
              <el-button type="info" @click="item.show = false">隐藏</el-button>
              <el-button type="danger" @click="onDelete(data,index)">删除</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-form
          class="form-option"
          :class="{multiple:['multiple_select','multiple_input'].includes(item.type)}"
          v-if="item.type"
          label-width="120px"
        >
          <!-- select -->
          <template v-if="item.type === 'select'">
            <el-form-item label="是否多选">
              <el-checkbox v-model="item.option.multiple">multiple</el-checkbox>
            </el-form-item>
            <el-form-item label="占位文字">
              <el-input placeholder="不输入就没有" v-model="item.option.placeholder" />
            </el-form-item>
            <el-form-item label="0值的文字">
              <el-input placeholder="不输入就没有" v-model="item.option.label_for_0" />
            </el-form-item>
            <el-form-item label="data值的键名">
              <el-input placeholder="默认Id" v-model="item.option.select_value" />
            </el-form-item>
            <el-form-item label="data文字的键名">
              <el-input placeholder="默认Name" v-model="item.option.select_label" />
            </el-form-item>
          </template>
          <!-- multiple_select -->

          <template v-else-if="item.type==='multiple_select'">
            <el-button @click="add(item)" icon="el-icon-plus" type="primary" class="multiple-add"></el-button>
            <div v-for="(select,index) in item.option" :key="index" class="sub-form">
              <el-form inline>
                <el-form-item label="字段">
                  <el-input v-model="select.key" />
                </el-form-item>
                <el-button type="danger" icon="el-icon-close" @click="onDelete(item.option,index)"></el-button>
              </el-form>
              <el-form>
                <el-form-item label="占位文字">
                  <el-input placeholder="不输入就没有" v-model="select.placeholder" />
                </el-form-item>
                <el-form-item label="0值的文字">
                  <el-input placeholder="不输入就没有" v-model="select.label_for_0" />
                </el-form-item>
                <el-form-item label="data值的键名">
                  <el-input placeholder="select_value" v-model="select.select_value" />
                </el-form-item>
                <el-form-item label="data文字的键名">
                  <el-input placeholder="select_label" v-model="select.select_label" />
                </el-form-item>
              </el-form>
            </div>
          </template>

          <!-- input -->

          <template v-else-if="item.type==='input'">
            <el-form-item label="是否禁用">
              <el-checkbox v-model="item.option.disabled">disabled</el-checkbox>
            </el-form-item>
            <el-form-item label="占位文字">
              <el-input placeholder="不输入就没有" v-model="item.option.placeholder" />
            </el-form-item>
          </template>

          <!-- multiple_input -->

          <template v-else-if="item.type==='multiple_input'">
            <el-button @click="add(item)" icon="el-icon-plus" type="primary" class="multiple-add"></el-button>

            <div v-for="(input,index) in item.option" :key="index" class="sub-form">
              <el-form inline>
                <el-form-item label="字段">
                  <el-input placeholder="字段" v-model="input.key" />
                </el-form-item>
                <el-button type="danger" icon="el-icon-close" @click="onDelete(item.option,index)"></el-button>
              </el-form>
              <el-form>
                <el-form-item label="是否禁用">
                  <el-checkbox v-model="input.disabled">disabled</el-checkbox>
                </el-form-item>
                <el-form-item label="占位文字">
                  <el-input placeholder="不输入就没有" v-model="input.placeholder" />
                </el-form-item>
              </el-form>
            </div>
          </template>

          <!-- switch -->

          <template v-else-if="item.type==='switch'">
            <el-form-item label="是否禁用">
              <el-checkbox v-model="item.option.disabled">disabled</el-checkbox>
            </el-form-item>
          </template>

          <!-- radio -->

          <template v-else-if="item.type==='radio'">
            <el-form-item label="卡片模式">
              <el-checkbox v-model="item.option.card">card</el-checkbox>
            </el-form-item>
            <el-form-item label="data值的键名">
              <el-input placeholder="默认Id" v-model="item.option.radio_value" />
            </el-form-item>
            <el-form-item label="data文字的键名">
              <el-input placeholder="默认Name" v-model="item.option.radio_label" />
            </el-form-item>
          </template>

          <!-- checkbox -->

          <template v-else-if="item.type==='checkbox'">
            <el-form-item label="卡片模式">
              <el-checkbox v-model="item.option.card">card</el-checkbox>
            </el-form-item>
            <el-form-item label="data文字的键名">
              <el-input placeholder="默认Name" v-model="item.option.checkbox_label" />
            </el-form-item>
          </template>
          <!-- date -->

          <template v-else-if="item.type==='date'">
            <el-form-item label="是否禁用">
              <el-checkbox v-model="item.option.disabled">disabled</el-checkbox>
            </el-form-item>
            <el-form-item label="是否只读">
              <el-checkbox v-model="item.option.readonly">readonly</el-checkbox>
            </el-form-item>
            <el-form-item label="返回时间戳">
              <el-checkbox v-model="item.option.timestamp">timestamp</el-checkbox>
            </el-form-item>
            <el-form-item label="占位文字">
              <el-input placeholder="不输入就没有" v-model="item.option.placeholder" />
            </el-form-item>
          </template>

          <!-- time -->

          <template v-else-if="item.type==='time'">
            <el-form-item label="是否禁用">
              <el-checkbox v-model="item.option.disabled">disabled</el-checkbox>
            </el-form-item>
            <el-form-item label="返回时间戳">
              <el-checkbox v-model="item.option.timestamp">timestamp</el-checkbox>
            </el-form-item>
            <el-form-item label="占位文字">
              <el-input placeholder="不输入就没有" v-model="item.option.placeholder" />
            </el-form-item>
            <el-form-item label="起始时间">
              <el-input placeholder="默认00:00:00" v-model="item.option.start" />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-input placeholder="默认23:59:59" v-model="item.option.end" />
            </el-form-item>
            <el-form-item label="时间跳跃">
              <el-input placeholder="HH:mm" v-model="item.option.step" />
            </el-form-item>
          </template>
          <!-- textarea -->

          <template v-else-if="item.type==='textarea'">
            <el-form-item label="占位文字">
              <el-input placeholder="不输入就没有" v-model="item.option.placeholder" />
            </el-form-item>
            <el-form-item label="文字长度">
              <el-input placeholder="默认100" v-model="item.option.max" />
            </el-form-item>
          </template>

          <!-- rich -->

          <template v-else-if="item.type==='rich'">
            <el-form-item label="占位文字">
              <el-input placeholder="不输入就没有" v-model="item.option.placeholder" />
            </el-form-item>
          </template>
        </el-form>
      </li>
      <li style="margin-top:100px">
        <textarea v-model="json" cols="30" rows="10" class="show-data"></textarea>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import {
  Input,
  Select,
  Option,
  Checkbox,
  Form,
  FormItem,
  ButtonGroup
} from "element-ui";
Vue.use(Input)
  .use(Select)
  .use(Checkbox)
  .use(Form)
  .use(FormItem)
  .use(ButtonGroup)
  .use(Option);
Vue.prototype.$ELEMENT = { size: "mini" };
import vuedraggable from "vuedraggable";
export default Vue.extend({
  components: {
    vuedraggable
  },
  data() {
    return {
      keys: "",
      form: [],
      hash: {
        readonly: "只读",
        select: "下拉",
        multiple_select: "层级下拉",
        input: "输入框",
        multiple_input: "层级输入",
        switch: "开关",
        radio: "单选",
        checkbox: "多选",
        textarea: "长文本",
        rich: "富文本",
        date: "日期",
        time: "时间"
      },
      formType: [
        "readonly",
        "select",
        "multiple_select",
        "input",
        "multiple_input",
        "switch",
        "radio",
        "checkbox",
        "textarea",
        "rich",
        "date",
        "time"
      ],
      data: [],
      option: {
        data: {
          key: null,
          type: 'readonly',
          column_span: 6,
          label: null,
          option: {},
          show: true
        },
        select: {
          multiple: false,
          label_for_0: null,
          select_value: null,
          select_label: null,
          placeholder: null,
          data: []
        },
        multiple_select: [
          {
            key: null,
            label_for_0: null,
            select_value: null,
            select_label: null,
            placeholder: null,
            data: []
          },
          {
            key: null,
            label_for_0: null,
            select_value: null,
            select_label: null,
            data: [],
            placeholder: null
          }
        ],
        input: {
          disabled: false,
          placeholder: null
        },
        multiple_input: [
          {
            key: null,
            disabled: false,
            placeholder: null
          },
          {
            key: null,
            disabled: false,
            placeholder: null
          }
        ],
        switch: {
          disabled: false
        },
        radio: {
          radio_value: null,
          radio_label: null,
          card: false,
          data: []
        },
        checkbox: {
          checkbox_label: null,
          data: [],
          card: false
        },
        textarea: {
          disabled: false,
          placeholder: null,
          max: 100
        },
        date: {
          disabled: false,
          readonly: false,
          timestamp: false,
          placeholder: null
        },
        time: {
          disabled: false,
          placeholder: null,
          timestamp: false,
          start: null,
          end: null,
          step: null
        },
        rich: {
          placeholder: null
        }
      },
      json: null
    };
  },

  methods: {
    onChangeType(item) {
      item.option = this.$copy(this.option[item.type]);
    },
    onDelete(arr, index) {
      arr.splice(index, 1);
    },
    add(item) {
      if (item) {
        item.option.push(this.$copy(this.option[item.type][0]));
      } else {
        this.data.push(this.$copy(this.option.data));
      }
    },
    formJson() {
      let { data } = this;
      window.localStorage.setItem("formConfig", JSON.stringify(data));
      let json = {};
      data.forEach(obj => {
        let { label, type, column_span, option, key } = obj;
        if (!key) {
          return;
        }
        let target = {
          label,
          type
        };
        column_span && (target.column_span = column_span);
        if (Array.isArray(option)) {
          //多
          let length = option.length;
          target.value = {};
          target.option = {};
          option.forEach(obj2 => {
            //option
            let { key, ...other } = obj2;
            target.value[key] = null;
            target.option[key] = {};
            Object.keys(other).forEach(k => {
              if (other[k]) {
                target.option[key][k] = other[k];
              }
            });
          });
        } else {
          //单
          target.value = null;
          let { key, ...other } = option;
          target.option = {};
          Object.keys(other).forEach(k => {
            if (other[k]) {
              target.option[k] = other[k];
            }
          });
          if (Object.keys(target.option).length === 0 ){
            delete target.option
          }
        }
        json[key] = target;
      });

      this.json = JSON.stringify(json, null, "  ");
    },
    create() {
      this.keys.split(",").forEach(key => {
        let obj = this.$copy(this.option.data);
        obj.key = key;
        this.data.push(obj);
      });
      this.keys = null;
    }
  }
});
</script>

<style lang="scss" scoped>
.drag-wrap {
  > p {
    display: inline-block;
    padding: 10px;
    border: 1px solid #ccc;
    margin: 10px;
    .show-btn {
      display: inline-block;
      height: 10px;
      width: 10px;
      border: 1px solid #ccc;
      &.active {
        background: blue;
      }
    }
  }
}
.form-config {
  margin: 0 auto;

  li {
    width: 1100px;
    margin: 10px auto;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
}
.sub-form {
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.form-info {
  .el-form-item--mini {
    margin-bottom: 0;
  }
}

.form-option {
  margin-top: 22px;
  width: 50%;
  &.multiple {
    padding-top: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    position: relative;
    width: 100%;
    .multiple-add {
      position: absolute;
    }
  }
}
.show-data {
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 80%;
  height: 200px;
  resize: none;
  margin: 10px 0;
  padding: 20px;
  color: #000;
}
.fixed-button {
  position: fixed;
  top: 0;
  right: 10px;
  z-index: 1;
}
</style>