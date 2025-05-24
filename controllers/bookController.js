const Book = require('../models/Book');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

exports.addBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, genre } = req.body;

  try {
    const book = new Book({
      title,
      author,
      genre,
      addedBy: req.user._id
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const { author, genre } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (author) query.author = new RegExp(author, 'i');
    if (genre) query.genre = new RegExp(genre, 'i');

    const books = await Book.find(query)
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'username');

    const total = await Book.countDocuments(query);

    res.json({
      data: books,
      page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'username');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

    res.json({
      book,
      averageRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
      reviews
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const books = await Book.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};