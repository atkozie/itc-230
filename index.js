'use strict'

const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const Book = require('./models/book.js');//using the database connection rather than array in file

app.set('port', process.env.PORT || 3000);

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require("body-parser").json()); //to make sure the server knows what's coming at it (SPA)
//app.use(require('body-parser').urlencoded({extended: true})); //this parses the POSTed form submissions
//app.use(require('body-parser').urlencoded({extended: true})); //this parses the POSTed form submissions
app.use('/api', require('cors')()); //cross-origin resource sharing, to use API on other sites
app.use(express.static(__dirname + '/public')); //path for static pages
app.use((err, req, res, next) => {
  console.log(err);
});
 
//You can specify here that views use a file extension other than 'html' if desired.
app.engine(".html", handlebars({extname: '.html', defaultLayout: 'main'}));
app.set("view engine", ".html");

// home page w/ the database connection
app.get('/', (req,res, next) => {
    Book.find((err,books) => {
        if (err) return next(err);
        res.render('home', { books: JSON.stringify(books) });    
    })
});

//about page is sent as a plain text response
app.get('/about', function(req,res, next){
    res.type('text/plain');
    res.send('This is the About page. It was rendered entirely within the server file');
});

//***begin API routes
//view a single title
app.get('/api/book/:title', (req,res, next) => {
    let title = req.params.title;
    Book.findOne({title:title}, (err, result) => {
        if (err || !result ) return (err);
        res.json( result );
    });// end Book.findOne
});// end app.get

//view all the books
app.get('/api/books', (req,res, next) => {
    Book.find((err,results) => {
        if (err || !results) return next(err);
        res.json(results);
    });// end Book.find
});// end app.get

// find & update existing item, or add new
app.post('/api/add/', (req,res, next) => {
    if (!req.body._id) {
        let book = new Book({title:req.body.title, author: req.body.author, genre: req.body.genre, pubdate: req.body.pubdate });
        book.save((err,newBook) => {
            if (err) return next(err);
            console.log(newBook)
            res.json({updated: 0, _id: newBook._id});
        });
    } else { // update existing document if `book exists al1redy
        Book.updateOne({ _id: req.body._id}, {title:req.body.title, author: req.body.author, genre: req.body.genre, pubdate: req.body.pubdate }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, _id: req.body._id});
        });// end Book.updateOne
    }// end else
});// end app.post

//update a book in database, or add new book to database
app.get('/api/add/:title/:author/:genre/:pubdate', (req,res, next) => {
    let title = req.params.title;
    Book.update({ title: title}, {title:title, author: req.params.author, genre: req.params.genre, pubdate: req.params.pubdate }, {upsert: true }, (err, result) => {//for the given title, push the updated attributes into the database
        if (err) return next(err);
        //return the number updated
        res.json({updated: result.nModified});
    });
});

//delete a book
app.get('/api/delete/:id', (req,res, next) => {
    Book.remove({"_id":req.params.id }, (err, result) => {
        if (err) return next(err);
        res.json({"deleted": result.result.n});
    });
});
//*** end API routes

//error handler
app.use(function(req,res, next) {
    res.type('text/plain'); 
    res.status(404);
    res.send('Page not found');
});
//***end non-API routes

//start server
app.listen(app.get('port'), function() { //listen on port 3000 as assigned above
    console.log('server started'); 
});