const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

/**
 * 사용자를 추가합니다.
 */
router.post('/', async (req, res, next) => {
    try {
        const email = req.body.email;
        const displayName = req.body.displayName;
        const password = req.body.password;

        const user = await db.User.findOne({
            where: {
                email: email,
            },
        });

        if (user) {
            return res.status(400).send('동일한 전자우편주소가 사용중입니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await db.User.create({
            email: email,
            displayName: displayName,
            password: hashedPassword,
        });

        delete user.password;

        return res.json(newUser);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.get('/me', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: {
                id: req.user.id,
            },
            include: [
                {
                    model: db.Post,
                },
            ],
            attributes: ['id', 'email', 'displayName'],
        });

        if (me) {
            return res.json(me);
        } else {
            return res.status(404).send('Could not find my info.');
        }
    } catch (e) {
        // console.error(e);
        return next(e);
    }
});

module.exports = router;
