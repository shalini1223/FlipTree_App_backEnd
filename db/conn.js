const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/flipTree', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", function () {
    console.log("Mongodb connection established successfly");
});