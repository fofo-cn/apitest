const socket = new WebSocket("ws://192.168.1.236:7785/machine");



socket.onmessage = e => {
  console.log(e);
};