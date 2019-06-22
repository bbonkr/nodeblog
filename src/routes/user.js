const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const Sequelize = require('sequelize');
const { isLoggedIn } = require('./middleware');
const { findUserById, defaultUserAttributes } = require('./helper');
const { randomString, sendMail } = require('./util');
const Op = Sequelize.Op;

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
        sendVerifyEmail(req, newUser);

        return res.json(me);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

/**
 * 비밀번호 변경
 */
router.patch('/changepassword', isLoggedIn, async (req, res, next) => {
    try {
        const { currentPassword, password, passwordConfirm } = req.body;

        const me = await db.User.findOne({
            where: { id: req.user.id },
        });

        const result = await bcrypt.compare(
            currentPassword.trim(),
            me.password,
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
router.patch('/info', isLoggedIn, async (req, res, next) => {
    try {
        const { email, username, displayName, photo } = req.body;
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });

        if (!me) {
            return res.status(404).send('Could not find account.');
        }

        let user = await db.User.findOne({
            where: {
                id: { [Op.not]: req.user.id },
                username: username.trim(),
            },
        });

        if (user) {
            return res
                .status(400)
                .send(`${username.trim()} used by other account.`);
        }

        user = await db.User.findOne({
            where: {
                id: { [Op.not]: req.user.id },
                email: email.trim(),
            },
        });

        if (user) {
            return res
                .status(400)
                .send(`${email.trim()} used by other account.`);
        }

        let isEmailConfirmed = me.isEmailConfirmed;
        if (me.email.toLowerCase() !== email) {
            // 전자우편이 변경되면 다시 확인해야 합니다.
            isEmailConfirmed = false;
        }

        const updatedMe = await me.update({
            email: email.trim(),
            username: username.trim(),
            displayName: displayName.trim(),
            photo: photo.trim(),
            isEmailConfirmed: isEmailConfirmed,
        });

        delete updatedMe.password;

        return res.json(updatedMe);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

const sendVerifyEmail = async (req, user) => {
    const serviceName = 'Nodeblog';
    const emailSender = 'app@bbon.kr';

    const { email } = user;
    const code = randomString(32);
    const hashedCode = await bcrypt.hash(code, 12);
    const hashedEmail = await bcrypt.hash(email, 12);
    const now = new Date();
    const term = 3 * 60 * 60 * 1000; // 3 hour after

    const url = `${req.protocol}://${req.get(
        'host',
    )}/verifyemail?email=${hashedEmail}&code=${hashedCode}`;

    const deleteCodes = await db.UserVerifyCode.findAll({
        where: { UserId: user.id },
    });

    if (!!deleteCodes && deleteCodes.length > 0) {
        // 이전 코드를 모두 제거합니다.
        await Promise.all(deleteCodes.map(v => v.destroy()));
    }

    const newVerifyCode = await db.UserVerifyCode.create({
        email: hashedEmail,
        code: hashedCode,
        expire: now.setTime(now.getTime() + term),
        UserId: user.id,
    });

    if (!newVerifyCode) {
        throw new Error('Could not process a request. ');
    }

    // TODO send mail
    const sent = await sendMail({
        to: email,
        from: emailSender,
        subject: `[${serviceName}] Verify your email address `,
        html: `
<h1>Verify Email Address</h1>
<p>Please navigate below link.</p>
<a href="${url}">Verify email</a>
<p>Please copy below url and paste address window on your web browser when may be unavailable navigating a link.</p>
<pre><code>${url}</code></pre>
<hr />
<p>Please do not reply this email.</p>
            `,
    });

    return sent;
};

/**
 * 전자우편 확인용 메시지를 전송합니다.
 */
router.post('/makeverifyemail', isLoggedIn, async (req, res, next) => {
    try {
        const sent = await sendVerifyEmail(req, req.user);
        if (!sent) {
            return res.send('Could not send mail.');
        }
        return res.send('Send mail success');
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

/** 전자우편주소 확인 */
router.post('/verifyemail', async (req, res, next) => {
    try {
        const { code, email } = req.body;

        const verified = await db.UserVerifyCode.findOne({
            where: {
                code: code,
                email: email,
                // expire: {
                //     [Op.gt]: new Date(),
                // },
            },
            include: [
                {
                    model: db.User,
                    attributes: defaultUserAttributes,
                },
            ],
        });

        if (!verified) {
            return res.status(404).send('Could not find a associated data.');
        }

        if (verified.expire < new Date()) {
            return res
                .status(400)
                .send(
                    'Your link has expired. Please retry to verify your email.',
                );
        }

        const user = await db.User.findOne({
            where: { id: verified.User.id },
        });

        if (!user) {
            return res.status(404).send('Could not find a associated data.');
        }

        await user.update({
            isEmailConfirmed: true,
        });

        const updatedUser = findUserById(user.id);

        return res.json({
            email: updatedUser.email,
            isEmailConfirmed: updatedUser.isEmailConfirmed,
        });
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
