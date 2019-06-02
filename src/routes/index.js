const router = require('express').Router();

router.use('/sample', require('./sample'));
router.use('/posts', require('./posts'));
router.use('/account', require('./account'));
router.use('/category', require('./category'));

module.exports = router;
