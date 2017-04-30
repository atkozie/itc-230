'use strict'
let books = [
    {title:"1984", author:"george orwell", genre:"science fiction", pubdate:1955},
    {title:"it", author:"stephen king", genre:"horror", pubdate:1985},
    {title:"moby dick", author:"herman melville", genre:"fiction", pubdate:1865}
];

//construct a list of books using key-value pairs.
exports.get = (title) => {
    return books.find((item) => {
        //console.log(item);
        return item.title == title;
    });
};
exports.delete = (title) => { //function to delete items
    const oldLength = books.length;
    let newBooks = books.filter((item) => {
        return item.title !== title; //only return the things that don't match what we want to delete
    })
    books = newBooks;
    return { deleted: oldLength !== books.length, total: books.length };
};

//console.log(this.delete("it"));

