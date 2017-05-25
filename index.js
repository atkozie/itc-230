'use strict'
//this is the server file

const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
//const book = require('./lib/book.js'); // we need the array from the other file
const Book = require('./models/book.js');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public')); //path for static pages
app.use(require('body-parser').urlencoded({extended: true})); //this parses the POSTed form submissions
 
//You can specify here that views use a file extension other than 'html' if desired.
app.engine(".html", handlebars({extname: '.html', defaultLayout: 'main'}));
app.set("view engine", ".html");

// home page w/ the database connection
app.get('/', (req,res) => {
    Book.find((err,books) => {
        if (err) return next(err);
        res.render('home', {books: books });    
    })
});

//the pages
//Route handlers are specified with app.get() or app.post(), & error handlers w/ app.use():
//home page is sent as static file - .html file is in public folder
app.get('/', function(req,res){
    res.type('text/html');
//    res.sendFile(__dirname + '/public/home.html'); //old code from pre-templating
    res.render('home', {books: book.getAll()}); //passing the getAll from book, as books
});

//app.get('/list', function(req,res){
//    res.type('text/html');
////    res.sendFile(__dirname + '/public/home.html'); //old code from pre-templating
//    res.render('list', {books: book.getAll()}); //passing the getAll from book, as books
//});

app.get('/list', function(req,res){
    Book.find((err,books) => {
        if (err) return (err);
        res.render('list', {books: books })
        });
    });

//about page is sent as a plain text response
app.get('/about', function(req,res){
    res.type('text/plain');
    res.send('This is the About page. It was rendered entirely within the server file');
});

////POST - using body-parser plugin
////this is the search button functionality with the array/library file
//app.post('/get', function(req,res){
//    let gotten = book.get(req.body.title);
//    res.render("details", {gotten: gotten});
//});
//
////this is the lick on a title functionality on the homepage
////here we use get instead of post, and params rather than body
//app.get('/get/:title', function(req, res){
//    res.type('text/html');
//   var gotten = book.get(req.params.title);
//    if(!gotten) {
//        found = {title: req.params.title}; 
//        }
//   res.render("details", {gotten: gotten, title: req.params.title});
//});

// begin database details routes
app.get('/get', (req,res,next) => {
    Book.findOne({ title:req.query.title }, (err, book) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: book} ); 
    });
});
app.post('/get', (req,res, next) => {
    Book.findOne({ title:req.body.title }, (err, book) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: book} ); 
    });
});
// end database details routes

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

