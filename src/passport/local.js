const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passowrdField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await db.User.findOne({
                        where: { email: email },
                    });

                    if (!user) {
                        return done(null, false, {
                            reason: '존재하지 않는 사용자입니다.',
                        });
                    }

                    const result = await bcrypt.compare(
                        password,
                        user.password,
                    );
                    if (result) {
                        delete user.password;

                        return done(null, user);
                    } else {
                        return done(null, false, {
                            reason: '비밀번호가 일치하지 않습니다.',
                        });
                    }
                } catch (e) {
                    console.error(e);

                    return done(e);
                }
            },
        ),
    );
};
