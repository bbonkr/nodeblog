const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const { findUserById } = require('./helper');

// const findUserById = async id => {
//     const me = await db.User.findOne({
//         where: {
//             id: id,
//         },
//         include: [
//             {
//                 model: db.Post,
//             },
//         ],
//         attributes: ['id', 'email', 'username'],
//     });

//     return me;
// };

/**
 * 사용자를 추가합니다.
 */
router.post('/', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

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
            username: username,
            password: hashedPassword,
        });

        const me = await findUserById(newUser.id);

        // TODO Send mail

        return res.json(me);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;
