//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/listDB', {useNewUrlParser: true, useUnifiedTopology: true});

const listSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", listSchema);

const item1 = new Item({
  name: "Workout"
});

let defaultItems = [item1];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
  Item.find({}, (err,foundItems) => {
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, (err) => {
        if(err){
          console.log(err);
        }else{
          console.log("List updated successfully!");
        }
        res.redirect("/");
      });
    }else{
      res.render("list", {listTitle: "Tasks for Today", newListItems: foundItems});
    }
  });
});

app.post("/", (req, res) => {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
});

app.post("/delete", (req,res) => {
  // console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if(err) {
      console.log(err);
    } else{
      console.log("Deletion successfull");
      res.redirect("/");
    }
  });
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
