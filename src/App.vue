<template>
  <div id="app">
    <el-button-group>
      <el-button v-for="i in page" :key="i" @click="show=i">{{i}}</el-button>
    </el-button-group>
    <component :is="show"></component>
  </div>
</template>

<script>
import Vue from "vue";
import apiTest from "@/components/apiTest.vue";
import formConfig from "@/components/formConfig.vue";
import { Button, ButtonGroup } from "element-ui";
Vue.use(Button).use(ButtonGroup);
export default {
  components: {
    apiTest,
    formConfig,
  },
  data() {
    return {
      show: "apiTest",
      page: ["apiTest", "formConfig"]
    };
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
#app {
  font-size: 16px !important;
}
</style>
