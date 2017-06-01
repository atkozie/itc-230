'use strict'

const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const Book = require('./models/book.js');//using the database connection rather than array in file

app.set('port', process.env.PORT || 3000);

app.use('/api', require('cors')()); //cross-origin resource sharing, to use API on other sites
app.use(express.static(__dirname + '/public')); //path for static pages
app.use(require('body-parser').urlencoded({extended: true})); //this parses the POSTed form submissions
 
//You can specify here that views use a file extension other than 'html' if desired.
app.engine(".html", handlebars({extname: '.html', defaultLayout: 'main'}));
app.set("view engine", ".html");

//***begin API routes
//view a single title
app.get('/api/book/:title', (req,res) => {
    let title = req.params.title;
    Book.findOne({title:title}, (err, result) => {
        if (err || !result ) return (err);
        res.json( result );
    });
});
//view all the books
app.get('/api/books', (req,res) => {
    Book.find((err,results) => {
        if (err || !results) return next(err);
        res.json(results);
    });
});
//update a book in database, or add new book to database
app.get('/api/add/:title/:author/:genre/:pubdate', (req,res) => {
    let title = req.params.title;
    Book.update({ title: title}, {title:title, author: req.params.author, genre: req.params.genre, pubdate: req.params.pubdate }, {upsert: true }, (err, result) => {//for the given title, push the updated attributes into the database
        if (err) return next(err);
        //return the number updated
        res.json({updated: result.nModified});
    });
});
//delete a book
app.get('/api/delete/:title', (req,res) => {
    Book.remove({"title":req.params.title }, (err, result) => {
        if (err) return next(err);
        res.json({"deleted": result.result.n});
    });
});
//***end API routes

//***begin normal routes
//Route handlers are specified with app.get() or app.post(), & error handlers w/ app.use():
//home page is sent as static file - .html file is in public folder

// home page w/ the database connection
app.get('/', (req,res) => {
    Book.find((err,books) => {
        if (err) return next(err);
        res.render('home', {books: books });    
    })
});
//list page with all books and details
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
//click on list on homepage to view details
app.get('/get/:title', (req,res) => {
    console.log(req.params.title)
    Book.findOne({ title:req.params.title }, (err, book) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: book} ); 
        console.log(book)
    });
});
//search to view details
app.post('/get', (req,res) => {
    Book.findOne({ title:req.body.title }, (err, book) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: book} ); 
    });
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
//    console.log(add)
    res.render("add", {title: req.body.title, author: req.body.author, genre: req.body.genre, pubdate: req.body.pubdate, add: add});//render the add.html page
});
//error handler
app.use(function(req,res) {
    res.type('text/plain'); 
    res.status(404);
    res.send('Page not found');
});
//***end non-API routes

//start server
app.listen(app.get('port'), function() { //listen on port 3000 as assigned above
});