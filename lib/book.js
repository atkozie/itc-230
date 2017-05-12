'use strict'

//construct a list of books using key-value pairs.
let books = [
    {title:"1984", author:"george orwell", genre:"science fiction", pubdate:1955},
    {title:"it", author:"stephen king", genre:"horror", pubdate:1985},
    {title:"moby dick", author:"herman melville", genre:"fiction", pubdate:1865}
];

exports.get = (title) => { //the search function
    return books.find((item) => {
        return item.title == title;
    });
};

exports.delete = (title) => { //function to delete items
    const oldLength = books.length;
    let newBooks = books.filter((item) => {
        return item.title !== title; //only return the things that don't match what we want to delete
    })
    books = newBooks;
    return { deleted: oldLength !== books.length, total: books.length };//check this: t or f 
};
//console.log(books.length);

exports.add = (title, author, genre, pubdate) => {//push the info entered into the array
    const oldLength = books.length; //original length of books array
    books.push({title : title, author : author, genre : genre, pubdate : pubdate}); 
    return { added: oldLength !== books.length, total: books.length }; //we're returning the new length if not equal to the old length.
};



exports.getAll = () => {
    return books;
};

