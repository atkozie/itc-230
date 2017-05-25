var mongoose = require("mongoose");
var credentials = require("../lib/credentials");

// connection string for remote database 

mongoose.connect(credentials.connectionString, options);

// remote db settings 
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }  } };

var conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:'));

// define Person model in JSON key/value pairs
// values indicate the data type of each key
var mySchema = mongoose.Schema({
 title: { type: String, required: true },
 author: { type: String, required: true },
 genre: { type: String, required: true },
 pubdate: { type: Number, required: true },
}); 

/*module.exports*/ var schemed = mongoose.model('books', mySchema); //names of the collection on mLab and the schema described above
//console.log(mySchema);
module.exports = schemed;

var conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:'));  

// REMEMBER THE CONNECTION WILL NOT WORK ON THE SCC NETWORK!