'use strict'
//this is the server file

const express = require("express");
const app = express();
const handlebars = require('express-handlebars');

app.set('port', process.env.PORT || 3000);

const book = require('./lib/book.js'); // we need the array from the other file

app.use(express.static(__dirname + '/public')); //path for static pages
app.use(require('body-parser').urlencoded({extended: true})); //this parses the POSTed form submissions
 
//You can specify here that views use a file extension other than 'html' if desired.
app.engine(".html", handlebars({extname: '.html', defaultLayout: 'main'}));
app.set("view engine", ".html");


//the pages
//Route handlers are specified with app.get() or app.post(), & error handlers w/ app.use():
//home page is sent as static file - .html file is in public folder
app.get('/', function(req,res){
    res.type('text/html');
//    res.sendFile(__dirname + '/public/home.html'); //old code from pre-templating
    res.render('home', {books: book.getAll()}); //passing the getAll from book, as books
});

app.get('/list', function(req,res){
    res.type('text/html');
//    res.sendFile(__dirname + '/public/home.html'); //old code from pre-templating
    res.render('list', {books: book.getAll()}); //passing the getAll from book, as books
});

//about page is sent as a plain text response
app.get('/about', function(req,res){
    res.type('text/plain');
    res.send('This is the About page. It was rendered entirely in the server file');
});

//POST - using body-parser plugin
app.post('/get', function(req,res){//URL will have /get? followed by querystring
    let gotten = book.get(req.body.title);
    res.render("details", {gotten: gotten});
});

// handle deletion with a GET
app.get('/delete', function(req,res){//URL will have /delete? followed by querystring
    let del = book.delete(req.query.title);
    res.render("delete", {title: req.query.title, del: del});//render the delete.html page
});

// adding items to the array using POST
app.post('/add', function(req,res){//URL will have /add? followed by querystring
    let add = book.add(req.body.title, req.body.author, req.body.genre, req.body.pubdate); //put all the items in the array
    //as we're using a POST for this function, we use req.body rather than req.query, which is for GETs
    console.log(add)
    res.render("add", {title: req.body.title, author: req.body.author, genre: req.body.genre, pubdate: req.body.pubdate, add: add});//render the add.html page
});

//error handler
app.use(function(req,res) {
    res.type('text/plain'); 
    res.status(404);
    res.send('Page not found');
});

//start server
app.listen(app.get('port'), function() { //listen on port 3000 as assigned above
});

