const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const bookController = require('../controllers/bookController');
const reviewController = require('../controllers/reviewController');

// Book routes
router.post('/', [
  auth,
  check('title', 'Title is required').not().isEmpty().trim(),
  check('author', 'Author is required').not().isEmpty().trim(),
  check('genre', 'Genre is required').not().isEmpty().trim()
], bookController.addBook);

router.get('/', [
  check('page', 'Page must be a positive integer').optional().isInt({ min: 1 }),
  check('limit', 'Limit must be a positive integer').optional().isInt({ min: 1 }),
  check('author', 'Author must be a string').optional().trim(),
  check('genre', 'Genre must be a string').optional().trim()
], bookController.getAllBooks);

router.get('/search', [
  check('query', 'Search query is required').not().isEmpty().trim()
], bookController.searchBooks);

router.get('/:id', [
  check('id', 'Invalid book ID').isMongoId()
], bookController.getBookDetails);

// Review routes
router.post('/:id/reviews', [
  auth,
  check('id', 'Invalid book ID').isMongoId(),
  check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment must be a string').optional().trim()
], reviewController.addReview);

router.put('/reviews/:id', [
  auth,
  check('id', 'Invalid review ID').isMongoId(),
  check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
  check('comment', 'Comment must be a string').optional().trim()
], reviewController.updateReview);

router.delete('/reviews/:id', [
  auth,
  check('id', 'Invalid review ID').isMongoId()
], reviewController.deleteReview);

module.exports = router;