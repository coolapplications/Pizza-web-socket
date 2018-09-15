import * as express from "express";
import { createServer } from "http";
import * as socketIO from "socket.io";

let app = express();
let http = createServer(app);
let io = socketIO(http);

let orders = [];

io.on("connection", socket => {
  console.log("user connected");

  socket.emit("order", JSON.stringify(orders));

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("add-order", message => {
    orders.push(JSON.parse(message));
    io.emit("order", JSON.stringify(orders));
  });
  socket.on("edit-order", message => {
    let partialOrder = JSON.parse(message);
    let order = orders.find(
      item => partialOrder.orderNumber === item.orderNumber
    );
    let index = orders.findIndex(
      item => partialOrder.orderNumber === item.orderNumber
    );
    order = { ...order, ...partialOrder };
    orders = [...orders.slice(0, index), order, ...orders.slice(index + 1)];
    io.emit("order", JSON.stringify(orders));
  });
});

http.listen(5000, () => {
  console.log("started on port 5000");
});
