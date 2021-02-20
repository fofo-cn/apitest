<template>
  <div id="apitest">
    <section class="user">
      <div v-if="name" class="login">
        <p>当前登陆：{{name}}，公司：{{CmpName}}</p>
        <el-button size="small" @click="logout">退出登陆</el-button>
      </div>
      <div v-else class="login">
        <p>
          <el-input size="small" type="text" v-model="LoginName">
            <template slot="prepend">账号</template>
          </el-input>
          <el-input size="small" type="password" v-model="LoginPwd">
            <template slot="prepend">密码</template>
          </el-input>
          <el-input size="small" v-model="vcode">
            <template slot="prepend">验证码</template>
          </el-input>
        </p>

        <img :src="imgCodeSrc" @click="get_vcode" height="32" />
        <br />
        <el-button size="small" @click="login">登陆</el-button>
      </div>
    </section>
    <section class="url">
      <div style="margin:10px 0">
        <div style="margin:10px 0">
          <el-radio-group v-model="methods">
            <el-radio label="get">GET</el-radio>
            <el-radio label="post">POST</el-radio>
          </el-radio-group>
        </div>
        <div style="margin:10px 0">
          <el-radio-group v-model="baseUrl">
            <el-radio label="https://webapi3.haobangni.com/">webapi3</el-radio>
            <el-radio label="https://api.haobangni.com/">api</el-radio>
          </el-radio-group>
        </div>
        <el-input size="small" v-model="api">
          <template slot="prepend">{{baseUrl}}</template>
        </el-input>
      </div>

      <template v-if="methods === 'post'">
        <ul>
          <li>
            <span style="margin-right:10px;">Args</span>
            <el-button
              circle
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="args.push({key: '',value: ''})"
            ></el-button>
          </li>
          <li v-for="(item,index) in args" :key="index" class="item">
            <el-input size="small" @input="assembly" type="text" v-model="item.key" />
            <span>:</span>
            <el-input size="small" @input="assembly" type="textarea" rows="1" v-model="item.value" />
            <el-button
              size="small"
              @click="checkTable(item.value)"
              type="text"
              icon="el-icon-question"
            ></el-button>
            <el-button
              size="small"
              @click="args.splice(index,1)"
              type="danger"
              icon="el-icon-minus"
            ></el-button>
          </li>
        </ul>
        <ul>
          <li>
            <span style="margin-right:10px;">Data</span>
            <el-button
              circle
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="data.push({key: '',value: ''})"
            ></el-button>
          </li>
          <li v-for="(item,index) in data" :key="index" class="item">
            <el-input size="small" @input="assembly" type="text" v-model="item.key" />
            <span>:</span>
            <el-input size="small" @input="assembly" type="textarea" rows="1" v-model="item.value" />
            <el-button
              size="small"
              @click="checkTable(item.value)"
              type="text"
              icon="el-icon-question"
            ></el-button>
            <el-button
              size="small"
              @click="data.splice(index,1)"
              type="danger"
              icon="el-icon-minus"
            ></el-button>
          </li>
        </ul>
      </template>
      <template v-if="methods==='get'">
        <ul>
          <li>
            <span style="margin-right:10px;">Params</span>
            <el-button
              circle
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="params.push({key: '',value: ''})"
            ></el-button>
          </li>
          <li v-for="(item,index) in params" :key="index" class="item">
            <el-input size="small" @input="assembly" type="text" v-model="item.key" />
            <span>:</span>
            <el-input size="small" @input="assembly" type="textarea" rows="1" v-model="item.value" />
            <el-button
              size="small"
              @click="checkTable(item.value)"
              type="text"
              icon="el-icon-question"
            ></el-button>
            <el-button
              size="small"
              @click="params.splice(index,1)"
              type="danger"
              icon="el-icon-minus"
            ></el-button>
          </li>
        </ul>
      </template>
      <div class="params-data" v-if="axiosData">
        <p>{{axiosData}}</p>
      </div>
      <el-button size="small" @click="ajax">请求</el-button>
    </section>
    <section v-loading="loading">
      <textarea v-model="res" cols="30" rows="10" class="show-data" v-if="ajaxState"></textarea>
      <p v-else class="ajax-fail">{{res}}</p>
    </section>
    <section class="history">
      <el-table :data="history" style="width: 100%" border :row-class-name="tableRowClassName">
        <el-table-column prop="methods" label="类型" width="80"></el-table-column>
        <el-table-column prop="baseUrl" label="接口" width="280"></el-table-column>
        <el-table-column prop="api" label="接口路径" width="280"></el-table-column>
        <el-table-column prop="axiosData" label="数据"></el-table-column>
        <el-table-column prop="result" label="结果" width="80"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, history)"
              type="text"
              size="small"
            >移除</el-button>
            <el-button
              @click.native.prevent="ajaxAgain(scope.$index, history)"
              type="text"
              size="small"
            >重来</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:10px;text-align:right" v-if="history.length>0">
        <el-button @click="clearHistory" size="small" type="danger">全部删除</el-button>
      </div>
    </section>

    <el-dialog :visible.sync="dialogTableVisible">
      <el-input
        size="small"
        @input="assembly"
        type="textarea"
        rows="10"
        v-model="dialogData.origin"
      />
      <div class="dialog-container">
        <table class="dialog-table">
          <tr v-for="(row,index) in dialogData.table" :key="index">
            <td v-for="(cell,index2) in row" :key="cell+'-'+index2">{{cell}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import {
  Button,
  Radio,
  Input,
  RadioGroup,
  Table,
  TableColumn,
  Loading,
  Drawer,
  Dialog
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Radio)
  .use(Input)
  .use(Button)
  .use(RadioGroup)
  .use(Table)
  .use(Loading)
  .use(TableColumn)
  .use(Dialog);
axios.defaults.headers = {
  "Content-Type": "application/json"
};
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  res => res,
  error => {
    if (error.response && error.response.status) {
      return Promise.reject(error.response.status);
    }
  }
);

export default {
  data() {
    return {
      flag: false,
      LoginName: "",
      LoginPwd: "",
      name: null,
      CmpName: null,
      methods: "get",
      baseUrl: "https://webapi3.haobangni.com/",
      api: "",
      dialogTableVisible: false,
      dialogData: {
        origin: "",
        table: [],
        _table: [],
        column: 0
      },
      args: [
        {
          key: "",
          value: ""
        },
        {
          key: "",
          value: ""
        },
        {
          key: "",
          value: ""
        }
      ],
      data: [
        {
          key: "",
          value: ""
        },
        {
          key: "",
          value: ""
        },
        {
          key: "",
          value: ""
        }
      ],
      params: [
        {
          key: "",
          value: ""
        },
        {
          key: "",
          value: ""
        },
        {
          key: "",
          value: ""
        }
      ],
      axiosData: null,
      history: [],
      res: null,
      ajaxState: null,
      loading: false,
      hbnclientid: null,
      vcode: null,
      imgCodeSrc: null
    };
  },
  created() {
    let history = localStorage.getItem("apiHistory");
    if (history) !!history && (this.history = JSON.parse(history));
    this.hbnclientid = this.NewGuid();
    this.get_vcode();

    this.getUser();
  },
  methods: {
    login() {
      let { LoginName, LoginPwd, vcode, hbnclientid } = this;
      axios
        .post("https://webapi3.haobangni.com/auth/unified/crmlogin", {
          args: {
            LoginName,
            LoginPwd,
            vcode,
            hbnclientid
          }
        })
        .then(
          res => {
            this.ajaxState = true;
            this.getUser();
          },
          res => {
            this.ajaxState = false;
            this.res = "登陆失败";
          }
        );
    },
    getUser() {
      axios.post("https://webapi3.haobangni.com/auth/unified/LoginInfo").then(
        res => {
          this.res = JSON.stringify(res.data.data, null, "\t");
          this.name = res.data.data.LoginName;
          this.CmpName = res.data.data.CmpName;
          this.ajaxState = true;
        },
        res => {
          this.res = res;
          this.ajaxState = false;
        }
      );
    },
    assembly() {
      switch (this.methods) {
        case "post":
          let data = {
            args: {},
            data: {}
          };
          Object.keys(data).forEach(k => {
            this[k].forEach(obj => {
              let { key, value } = obj;
              if (!!key && !!value) {
                data[k][key] = value;
              }
            });
          });
          this.axiosData = data;
          break;
        case "get":
          this.axiosData = this.params
            .map(obj => {
              let { key, value } = obj;
              if (!!key && !!value) {
                return `${key}=${value}`;
              }
            })
            .filter(i => !!i)
            .join("&");
          break;
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
      window.localStorage.setItem("apiHistory", JSON.stringify(this.history));
    },
    ajaxAgain(index, rows) {
      let { methods, baseUrl, api, axiosData } = rows[index];
      this.methods = methods;
      this.baseUrl = baseUrl;
      this.api = api;
      this.axiosData = JSON.parse(axiosData);
      window.scrollTo(0, 0);
      switch (methods) {
        case "get":
          let params = [];
          this.axiosData.split("&").forEach(i => {
            let [key, value] = i.split("=");
            params.push({ key, value });
          });
          this.params = params;
          break;
        case "post":
          this.args = Object.keys(this.axiosData.args).map(key => {
            return {
              key,
              value: this.axiosData.args[key]
            };
          });
          this.data = Object.keys(this.axiosData.data).map(key => {
            return {
              key,
              value: this.axiosData.data[key]
            };
          });
          break;
      }
    },
    pushHistory() {
      let { baseUrl, api, methods, axiosData, ajaxState, res } = this;
      let isFind = this.history.findIndex(i => i.api === api);
      let obj = {
        methods,
        baseUrl,
        api,
        axiosData: JSON.stringify(axiosData),
        result: ajaxState ? "成功" : res
      };
      if (isFind > -1) {
        let obj2 = this.history[isFind];
        if (obj2.methods === methods && obj2.baseUrl === baseUrl) {
          this.history.splice(isFind, 1);
        }
      }
      this.history.unshift(obj);
      window.localStorage.setItem("apiHistory", JSON.stringify(this.history));
      this.loading = false;
    },
    ajax() {
      this.assembly();
      let { baseUrl, api, methods, axiosData } = this;
      let url = baseUrl + api;
      this.loading = true;
      switch (methods) {
        case "get":
          let params = {};
          this.params.forEach(obj => {
            if (obj.value) {
              params[obj.key] = obj.value;
            }
          });
          axios
            .get(url, { params })
            .then(
              res => {
                this.res = JSON.stringify(res.data, null, "\t");
                this.ajaxState = true;
              },
              res => {
                this.ajaxState = false;
                this.res = JSON.stringify(res, null, "\t");
              }
            )
            .then(this.pushHistory);
          break;
        case "post":
          axios
            .post(url, axiosData)
            .then(
              res => {
                this.ajaxState = true;
                this.res = JSON.stringify(res.data, null, "\t");
              },
              res => {
                this.ajaxState = false;
                this.res = JSON.stringify(res, null, "\t");
              }
            )
            .then(this.pushHistory);

          break;
      }
    },
    logout() {
      axios.get("https://api.haobangni.com/auth/unified/quit").then(res => {
        this.res = res.data;
        this.name = null;
        this.CmpName = null;
      });
    },
    clearHistory() {
      this.history = [];
      window.localStorage.removeItem("apiHistory");
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.result !== "成功") {
        return "ajax-fail";
      } else {
        if (row.methods === "get") {
          return "ajax-get";
        } else if (row.methods === "post") {
          return "ajax-post";
        } else {
          return "";
        }
      }
    },
    NewGuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      var uuid = s.join("");
      return uuid;
    },
    get_vcode() {
      this.imgCodeSrc = `https://webapi3.haobangni.com/auth/unified/vcode?hbnclientid=${
        this.hbnclientid
      }&random=${Math.random()}`;
    },
    checkTable(e) {
      this.dialogData.origin = e;
      try {
        this.dialogData.table = e.split("\n").map(i => i.split("\t"));
        this.dialogData._table = this.dialogData.table.map(strArr => {
          let obj = {};
          strArr.forEach((str, i) => {
            obj["cell-" + i] = str;
          });
          return obj;
        });
        console.log(this.dialogData.table);
        console.log(JSON.stringify(this.dialogData.table));
        
        this.dialogTableVisible = true;
      } catch (error) {
        window.alert("解析失败");
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.login {
  > p {
    display: flex;
    height: 40px;
    line-height: 40px;
  }
}
section {
  width: 1000px;
  margin: 10px auto;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #888;
}
.item {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto 1fr auto auto;
  grid-gap: 10px;
  margin: 10px 0;
  > span {
    text-align: center;
    line-height: 32px;
  }
}
.params-data {
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 100px;
  margin: 10px 0;
  padding: 20px;
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
.ajax-fail {
  text-align: center;
  line-height: 2;
  color: #fff;
  background: red;
}

.dialog-table {
  border-collapse: collapse;
  border-spacing: 0;
  margin: 10px 0;
  td {
    border: 1px solid #cbcbcb;
    font-size: inherit;
    margin: 0;
    overflow: visible;
    padding: 0.5em 1em;
    background-color: transparent;
  }
}
.dialog-container {
  height: 200px;
  overflow-y: auto;
}
</style>

