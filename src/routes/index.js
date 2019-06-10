const router = require('express').Router();

router.use('/sample', require('./sample'));
router.use('/posts', require('./posts'));
router.use('/post', require('./post'));
router.use('/account', require('./account'));
router.use('/category', require('./category'));
router.use('/categories', require('./categories'));
router.use('/tag', require('./tag'));
router.use('/tags', require('./tags'));
router.use('/user', require('./user'));
router.use('/me', require('./me'));

module.exports = router;
