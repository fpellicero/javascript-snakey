const path = require('path');
var express = require('express');
var app = express();

app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/css", express.static(path.join(__dirname, "css")));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT, function() {
  console.log("Server Started");
})
