//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

const homeStartingContent = "Compose any text-only blog-post you like and it will be hosted here and publically available forever. Link your friends and enemies to your article to show them what you have created. No illegal content allowed. Everything else is fair play. Below is a list of all the other posts people have created.";
const aboutContent = "Made with EJS, CSS, Node/Express, MongoDB/Mongoose. Completed as an extensions of the blog tutorial from The App Brewery.";
const contactContent = "This experiment was made by me. Contact me.";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
};

const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    if (!err) {
      res.render('home', {
        homeStartingContent,
        posts
      });
    } else {
      console.log(err);
    }
  })
})

app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent
  });
})

app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent
  });
})

app.get('/compose', (req, res) => {
  res.render('compose');
})

app.post('/compose', (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save((err => {
    if (!err) {
      res.redirect('/');
    } else {
      console.log(err);
    }
  }));
})

app.get('/:id', (req, res) => {
  const requestedId = req.params.id;
  Post.findById(requestedId, (err, post) => {
    res.render('post', {
      title: post.title,
      content: post.content
    })
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
