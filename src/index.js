const express = require('express');
const db = require('./models');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
const dotenv = require('dotenv');
const next = require('next');
const axios = require('axios');
const path = require('path');
// const userApiRouter = require('./routes/user');
// const postsApiRouter = require('./routes/posts');
// const postApiRouter = require('./routes/post');
// const hashtagApiRouter = require('./routes/hashtag');
// const sampleApiRouter = require('./routes/sample');
const addApiRoutes = require('./routes');

const expressApp = express();

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

db.sequelize.sync({
    // If force is true, each Model will run DROP TABLE IF EXISTS, before it tries to create its own table
    force: true,
});

passportConfig();

nextApp.prepare().then(() => {
    /** express app */

    // logging
    expressApp.use(morgan('dev'));

    // form data
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use('/', express.static('uploads'));
    expressApp.use('/', express.static(path.join(__dirname, 'public')));

    expressApp.use(
        cors({
            origin: true,
            credentials: true,
        }),
    );
    expressApp.use(cookieParser(process.env.COOKIE_SECRET));
    expressApp.use(
        expressSession({
            name: 'nodebird',
            resave: false,
            saveUninitialized: false,
            secret: process.env.COOKIE_SECRET,
            cookie: {
                httpOnly: true,
                secure: false, // https 사용시 true
            },
            // store:
        }),
    );

    expressApp.use(passport.initialize());
    expressApp.use(passport.session());

    expressApp.use('/api', require('./routes'));

    // expressApp.get('/hashtag/:tag', (req, res) =>
    //     nextApp.render(req, res, '/hashtag', { tag: req.params.tag }),
    // );

    // expressApp.get('/user/:id', (req, res) =>
    //     nextApp.render(req, res, '/user', { id: req.params.id }),
    // );

    // expressApp.get('/post/:id', (req, res) =>
    //     nextApp.render(req, res, '/post', { id: req.params.id }),
    // );

    // => /:slug URL은 /content/:slug 에서 처리합니다.
    // expressApp.get('/post/:slug', (req, res) => {
    //     return nextApp.render(req, res, '/post', { slug: req.params.slug });
    // });

    expressApp.get('/:slug', (req, res) => {
        return nextApp.render(req, res, '/content', { slug: req.params.slug });
    });

    expressApp.get('*', (req, res) => handle(req, res));

    // seed data
    console.log('start to insert seed data.');
    const { seed } = require('./config/seed');
    seed();
    console.log('insert seed data completed.');

    expressApp.listen(3000, () => {
        console.log('server is running on http://localhost:3000');
    });
});
