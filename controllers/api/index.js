const router = require('express').Router();


const postRoutes = require ('./post-route');
const userRoutes = require ('./user-route');
const commentRoutes = require('./comment-route');

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);


module.exports = router;