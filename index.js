'use strict'

const express = require("express");
const app = express();

app.set('port', process.env.PORT || 3000);

var book = require('./lib/book.js'); //and we need the array from the other file

/*
var http = require("http"), fs = require("fs"), qs = require("querystring"); //we need the querystring in the URL. fs and qs are variable we create here



function serveStatic(res, path, contentType, responseCode){
    if(!responseCode) responseCode = 200; //if successful and no error codes
    fs.readFile(__dirname + path, function(err, data){
        if(err){ //if there's an error
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('500 Server Error'); //tell the user
        }
        else { //if no errors
            res.writeHead(responseCode, {'Content-Type': contentType});
            res.end(data); //proceed to write the content
        }
    });
}


http.createServer((req,res) => {
    let url = req.url.split("?"); //create a variable called url, splits the url around the question mark. Becomes an array with two items in it, separated by the ?
    let params = qs.parse(url[1]); //parse the querystring into the piece you need, in this case the 
    console.log(params); 
    let path = url[0].toLowerCase(); //fix URL to all lowercase
    switch(path) {
            
        case '/': //if nothing after slash, it's the homepage
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('This is the home page');
          break;
            
        case '/about': //about page, etc...
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('This is the about page');
          break; 
            
        case '/get':
          let found = book.get(params.title); //get the book's title
          res.writeHead(200, {'Content-Type': 'text/plain'}); //gonna display the title in plain text
          res.end('Results for ' + params.title + "\n" + JSON.stringify(found)); //display the info exported
          break;   
            
        case '/delete':
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('Entry for the title ' + params.title + ' has been deleted!');
          break;  
            
        default:
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end('Sorry, page not found!');
          break;
    }
   

}).listen(process.env.PORT || 3000); //view this on localhost at http://127.0.0.1:3000/
 */

app.use(express.static(__dirname + '/public')); //path for static pages
app.use(require("body-parser").urlencoded({extended: true})); //this parses the form submissions

//Express can use a 'view' to render dynamic information that differs with each request. 
//You can specify that views use a file extension other than 'html' if desired.
let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html'}));
app.set("view engine", ".html");

//the pages
//Route handlers are specified with app.get() or app.post(), & error handlers w/ app.use():
//home page is sent as static file - .html file is in public folder
app.get('/', function(req,res){
    res.type('text/html');
    res.sendFile(__dirname + '/public/home.html'); 
});
//about page is sent as a plain text response
app.get('/about', function(req,res){
    res.type('text/plain');
    res.send('About page');
});
//POST - using body-parser plugin
app.post('/get', function(req,res){//URL will have /get? followed by querystring
    var gotten = book.get(req.body.title);
    res.render("details", {gotten: gotten});
    //console.log(req.body); // display parsed form submission
});
// handle deletion with a GET
app.get('/delete', function(req,res){//URL will have /delete? followed by querystring
    let del = book.delete(req.query.title);
    res.render("delete", {title: req.query.title, del: del});//render the delete.html page
});
//error handler
app.use(function(req,res) {
    res.type('text/plain'); 
    res.status(404);
    res.send('Page not found');
});


//start the server
app.listen(app.get('port'), function() { //listen on port 3000 as assigned above
    console.log('Server has been started');  //print a message to user 
});

