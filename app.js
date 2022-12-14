//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const e = require("express");
const url = require('url');

// connect to mongodb using Mongoose
mongoose.connect('mongodb+srv://admin-evans:Test-2030@cluster0.zyra5kw.mongodb.net/blogDB');


// Create a schema
const postSchema = mongoose.Schema({
  title : String,
  content: String
});

// Create a model
const Post = mongoose.model("Post", postSchema);

// create Default Items
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// render all posts to the homepage
app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if(!err){    
      res.render("home", {homeStartingContent: homeStartingContent, posts:posts});      
    }else{
      console.log(err);
    }
  });
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent})
})

// Open the post composing page
app.get("/compose", function(req, res){
  console.log("Compose a new post");
  res.render("compose");
});

// Open posts using their post._id
app.get("/posts/:postID", function(req, res){
  requestedPostId = req.params.postID;

  Post.findOne({_id:requestedPostId}, function(err, post){
    if(!err){
      res.render("post", {title:post.title, content:post.content, postId:post._id})
    }
  });
 
});

// compose new Post
app.post("/compose", function(req, res){  
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  // check whether post is being published
  const publish = req.body.publish;
  if(publish){
    post.save(function(err){
      if(!err){
        res.redirect("/");
        console.log("Post published");
      }
    });
  }else{
    res.redirect("/");
    console.log("Post discarded");
  }
    
});

app.post('/delete', function(req, res){
  // get the _id if the current post
  const deletePostId = req.body.deletePost;
  console.log(deletePostId);
  // find and remove the post from PostDb using its ID 
  Post.findByIdAndDelete(deletePostId, function(err){
    if(!err){
      res.redirect('/');
      console.log("Post deleted successuly");
    }
  });
  
});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});

