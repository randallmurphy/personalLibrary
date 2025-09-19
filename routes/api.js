/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

// Define schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  // ===== ROUTE: /api/books =====
  app.route('/api/books')
    // GET all books
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        const response = books.map(b => ({
          _id: b._id,
          title: b.title,
          commentcount: b.comments.length
        }));
        res.json(response);
      } catch (err) {
        res.status(500).send('Server error');
      }
    })

    // POST new book
    .post(async function (req, res) {
      const title = req.body.title;
      if (!title) return res.send('missing required field title');
      try {
        const newBook = new Book({ title });
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title });
      } catch (err) {
        res.status(500).send('Server error');
      }
    })

    // DELETE all books
    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Server error');
      }
    });

  // ===== ROUTE: /api/books/:id =====
  app.route('/api/books/:id')
    // GET book by id
    .get(async function (req, res) {
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.send('no book exists');
      }
    })

    // POST comment to book
    .post(async function (req, res) {
      const { comment } = req.body;
      if (!comment) return res.send('missing required field comment');
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        book.comments.push(comment);
        const updatedBook = await book.save();
        res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments
        });
      } catch (err) {
        res.send('no book exists');
      }
    })

    // DELETE book by id
    .delete(async function (req, res) {
      try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
};
