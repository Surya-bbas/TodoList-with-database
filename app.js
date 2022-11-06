//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(`mongodb+srv://admin:Surya007bbas@cluster0.xsxv4ry.mongodb.net/todoDB`)

const itemSchema =  new mongoose.Schema({
  name:{
    type:String,
    require:[true,`enter task pls`]
  }
})

const listSchema = new mongoose.Schema({
  listName:{
    type:String,
    require:true
  },
  name:String

})

const List = mongoose.model(`List`,listSchema)

const Item = mongoose.model(`Item`,itemSchema)

async function db(){
  

  const item1 = new Item({name:`Welcome To Your TodoList`})

  const item2 =  new Item({name:`Hit the '+' to add new task`})

  const item3 = new Item({name:`<- Click here to check out your task`})
  
  const defaultItem = [item1,item2,item3] 
  
  app.get("/", async function(req, res) {

    const day = date.getDate();
    
    const list =  await Item.find({},{name:1}) 
    
 
    const listLength = list.length

    if (listLength===0) {
      await Item.insertMany(defaultItem)
      // defaultList is the obj from DB
      const defaultList=  await Item.find({},{name:1} )
      
      res.render("list", {listTitle: day, newListItems:defaultList});

      return
    } 
    
    res.render("list", {listTitle: day, newListItems:list});

  });

}

db()

// app.get(`/:categories`, async (req,res)=>{

//   const customListName = req.params.categories

//   res.send(customListName)

//   const list = new List({

//     listName:customListName,
    
//   })
  
//   await list.save()

//   const customList = await List.findOne({listName:`customListName`})

//   if (customList===null) {

//     const list = new List({

//       listName:customListName,
      
//     })
    
//     await list.save()
    
//   } else {

//     res.render(`list`,{listTitle:customListName, newListItems:customList})
    
//   }

//   console.log(customList);
 
// })

app.post("/", async function(req, res){

  const item = req.body.newItem;

  console.log(`new item : ${item}`);

  if (item===``) {
    return
  }
  await Item.create({
    name:item
  })

  res.redirect(`/`)
});

app.post(`/delete`, async (req,res)=>{
  const checkedId = req.body.checkbox
  await Item.findByIdAndRemove(checkedId)
  res.redirect(`/`)
})

app.listen(process.env.PORT ||3000 , function() {
  console.log("Server started on port 3000");
});
