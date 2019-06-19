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
        const { email, username, password, displayName } = req.body;

        let user = {};

        user = await db.User.findOne({
            where: {
                email: email,
            },
        });

        if (user) {
            return res.status(400).send(`${email} used by other account.`);
        }

        user = await db.User.findOne({
            where: { username: username.trim() },
        });

        if (user) {
            return res.status(400).send(`${username} used by other account.`);
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 12);
        const newUser = await db.User.create({
            email: email.trim(),
            username: username.trim(),
            displayName: displayName.trim(),
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

// TODO: change password
router.patch('/changepassword', isLoggedIn, async (req, res, next) => {
    try {
        const { currentPassword, password, passwordConfirm } = req.body;

        const me = await db.User.findOne({
            where: { id: req.user.id },
        });

        const result = await bcrypt.compare(
            currentPassword.trim(),
            me.password
        );

        if (!result) {
            return res.status(401).send('Password does not match.');
        }

        if (password.trim() !== passwordConfirm.trim()) {
            return res
                .status(400)
                .send('Password and confirm password is different.');
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 12);

        const updatedMe = await me.update({ password: hashedPassword });

        delete updatedMe.password;

        return res.json(updatedMe);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});
// TODO: change Email, username, displayname, photo src

module.exports = router;
