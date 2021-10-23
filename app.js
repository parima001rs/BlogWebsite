const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining es";
const contactContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMa";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

main().catch(err=> console.log(err));
async function main(){
    await mongoose.connect("mongodb://localhost:27017/blogDB");
}

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
    Post.find({}, function(err, posts){
        res.render("home", {
            homeArea: homeStartingContent, 
            posts: posts,
        });
    });
});



app.get("/compose", function(req, res){
    res.render("compose");
});

app.post("/compose", function(req,res){

    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent
    });

    post.save(function(err){
        if(!err){
            res.redirect("/");
        }
    });
});

app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {
            title: post.title, 
            content: post.content
        });
    });

});


app.get("/about", function(req, res){
    res.render("about", {aboutArea: aboutContent});
});

app.get("/contact", function(req, res){
    res.render("contact", {contactArea: contactContent});
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});