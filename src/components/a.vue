<template>
  <div>
    <ul class="form-config">
      <li>
        <el-button @click="add(0)" icon="el-icon-plus" type="primary"></el-button>
      </li>
      <li v-for="(item,index) in data" :key="index">
        <table border="1" cellspacing="0">
          <tr>
            <th>类型</th>
            <th>字段</th>
            <th>文字</th>
            <th>栅格</th>
            <th>操作</th>
          </tr>
          <tr>
            <th>
              <el-select
                size="mini"
                placeholder="类型"
                v-model="item.type"
                @change="onChangeType(item)"
              >
                <el-option v-for="type in formType" :key="type" :value="type">{{type}}</el-option>
              </el-select>
            </th>
            <th>
              <el-input placeholder="字段" v-model="item.key" />
            </th>
            <th>
              <el-input placeholder="文字" v-model="item.label" />
            </th>
            <th>
              <el-input placeholder="栅格" v-model="item.column_span" type="number" />
            </th>
            <th>
              <el-button
                type="primary"
                plain
                icon="el-icon-arrow-down"
                @click="item.show_option = !item.show_option"
              ></el-button>
              <el-button type="danger" icon="el-icon-close" @click="onDelete(data,index)"></el-button>
            </th>
          </tr>
        </table>
      </li>
      <li style="margin-top:100px">
        <el-button @click="formJson">确认</el-button>
        <textarea v-model="json" cols="30" rows="10" class="show-data"></textarea>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import { Input, Select, Option, Checkbox } from "element-ui";
import { log } from "util";
Vue.use(Input)
  .use(Select)
  .use(Checkbox)
  .use(Option);
Vue.prototype.$ELEMENT = { size: "mini" };
export default Vue.extend({
  data() {
    return {
      formType: [
        "select",
        "multiple_select",
        "input",
        "multiple_input",
        "switch",
        "radio",
        "checkbox",
        "textarea",
        "rich"
      ],
      show_option: [true, true],
      data: [],
      option: {
        data: {
          key: null,
          type: null,
          column_span: null,
          label: null,
          option: {},
          show_option: true
        },
        select: {
          multiple: false,
          label_for_0: null,
          select_value: null,
          select_label: null,
          placeholder: null
        },
        multiple_select: [
          {
            key: null,
            label_for_0: null,
            select_value: null,
            select_label: null,
            placeholder: null
          },
          {
            key: null,
            label_for_0: null,
            select_value: null,
            select_label: null,
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
          card: false
        },
        checkbox: {
          checkbox_label: null,
          card: false
        },
        textarea: {
          disabled: false,
          placeholder: null,
          max: 100
        },
        rich: {
          placeholder: null
        }
      },
      json: null
    };
  },

  created() {
    this.data = [this.$copy(this.option.data)];
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
      let json = {};
      data.forEach(obj => {
        let { label, type, column_span, option, key } = obj;
        if (!key) {
          return;
        }
        let key2 = key;
        let target = {
          label,
          type
        };
        column_span && (target.column_span = column_span);
        if (Array.isArray(option)) {
          //多
          let length = option.length;
          target.value = Array(length).fill(null);
          target.option = {};
          option.forEach(obj2 => {
            //option
            let { key, ...other } = obj2;
            target.option[key] = {};
            Object.keys(other).forEach(k => {
              if (other[k] !== this.option[type][0][k]) {
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
            if (other[k] !== this.option[type][k]) {
              target.option[k] = other[k];
            }
          });
        }
        json[key] = target;
      });
      this.json = JSON.stringify(json, null, "\t");
    }
  }
});
</script>

<style lang="scss" scoped>
.form-config {
  width: 900px;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 4px;

  li {
    margin: 10px 0;

    .el-select {
      margin-right: 16px;
    }
    .el-input {
      margin-right: 16px;
      width: 140px;
    }
    .el-checkbox {
      margin-right: 16px;
    }
  }
}
.option {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 4px;
  &.top {
    .multiple {
      width: 100%;
      margin: 10px 0;
    }
  }
}
.show-data {
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 90%;
  height: 200px;
  resize: none;
  margin: 10px 0;
  padding: 20px;
  color: #000;
}
</style>