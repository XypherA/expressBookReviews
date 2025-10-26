const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Simulate async call using Promise/axios
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) resolve(books);
                else reject("No books found");
            });
        };

        const allBooks = await getBooks();
        return res.status(200).json(allBooks);
    } catch (err) {
        return res.status(404).json({message: err});
    }
});

public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const getBookByISBN = () => new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });

        const book = await getBookByISBN();
        return res.status(200).json(book);
    } catch (err) {
        return res.status(404).json({message: err});
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(b => b.author === author);
            filtered.length ? resolve(filtered) : reject("No books found by this author");
        });

        const authorBooks = await getBooksByAuthor();
        return res.status(200).json(authorBooks);
    } catch (err) {
        return res.status(404).json({message: err});
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const getBooksByTitle = () => new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(b => b.title === title);
            filtered.length ? resolve(filtered) : reject("No books found with this title");
        });

        const titleBooks = await getBooksByTitle();
        return res.status(200).json(titleBooks);
    } catch (err) {
        return res.status(404).json({message: err});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
