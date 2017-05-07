var expect = require("chai").expect;
var book = require("../lib/book");


describe("BookCheck", () => { //function checks success and failure parameters. We're testing the book search
    it("finds valid book", function() { //this is what we're expecting
        var result = book.get("1984"); //success
        expect(result).to.deep.equal({title:"1984", author:"george orwell", genre:"science fiction", pubdate:1955}); //check array attributes of a book
//        console.log("successfully found your book!");
    }); //end success
    
    it("fails to find invalid book", () => { //here's failure
        var result = book.get("no book here"); 
        expect(result).to.be.undefined;
//        console.log("that book doesn't seem to exist");
    }); //end failure
}); //end BookCheck function


describe("DeleteCheck", () => { //function checks deletion
    //return { deleted: oldLength !== books.length, total: books.length };//check this: t or f
    it("finds that a book was deleted", function() {
        var result = book.delete("1984");
        expect(result).to.deep.equal({ deleted: true, total: 2 }); //check array attributes of the deleted book
//        console.log("successfully deleted your book!");
    }); //end deletion success
    
    it("finds that a book was not deleted", () => {
        var result = book.delete("no book was deleted"); 
        expect(result).to.deep.equal({ deleted: false, total: 2 });
//        console.log("that book could not be deleted, sorry");
    }); //end deletion failure
}); //end DeleteCheck function


describe("AddCheck", () => { //function checks add functionality
    it("finds that a book was added", function() { //this is what we're expecting
        var result = book.add("test book", "test author", "test genre", 1970);
        expect(result).to.deep.equal({ added: true, total: 3 }); //check array attributes of a book
    }); //end add book success
    
    it("finds that a book was not added", () => {
        var result = book.get("no book"); //search, so we're not adding anything here...
        expect(result).to.be.undefined;
    }); //end add book failure
}); //end AddCheck function