import Vue from "vue";
import App from "./App.vue";

// import VueSocketIO from "vue-socket.io";
// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: "ws://192.168.1.236:7785/",
//     options: { path: "machine" }
//   })
// );



Vue.config.productionTip = false;
Vue.prototype.$copy = a => JSON.parse(JSON.stringify(a));
new Vue({
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
