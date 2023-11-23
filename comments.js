// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const Comment = require('../models/comment');
const Post = require('../models/post');

// Import middleware
const auth = require('../middleware/auth');

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post(
  '/',
  auth,
  [
    check('comment', 'Comment is required').not().isEmpty(),
    check('post', 'Post is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // Create comment
      const comment = new Comment({
        comment: req.body.comment,
        post: req.body.post,
        user: req.user.id,
      });

      // Save comment
      await comment.save();

      // Get post
      const post = await Post.findById(req.body.post);

      // Add comment to post
      post.comments.unshift(comment.id);

      // Save post
      await post.save();

      // Send response
      res.json(comment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Get comment
    const comment = await Comment.findById(req.params.id);

    // Check if comment exists
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    // Check if user is authorized
    if (comment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Update comment
    comment.comment = req.body.comment;

    // Save comment
    await comment.save();

    // Send response
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete






