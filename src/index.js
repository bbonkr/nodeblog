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
const path = require('path');
const DatabaseSessionStore = require('./passport/databaseSessionStore');
const expressApp = express();

dotenv.config();

const serverPort = process.env.PORT || 3000;

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

db.sequelize.sync({
    // If force is true, each Model will run DROP TABLE IF EXISTS, before it tries to create its own table
    force: false,
});

passportConfig();

const dbSessionStore = new DatabaseSessionStore({
    database: db,
    expiration: 1000 * 60 * 60 * 24 * 90,
});

nextApp.prepare().then(() => {
    /** express app */

    // logging https://github.com/expressjs/morgan
    expressApp.use(morgan('dev'));

    // form data
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use('/uploads', express.static('uploads'));
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
            store: dbSessionStore,
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

    // expressApp.get('/signin', (req, res) => {
    //     return nextApp.render(req, res, '/signin', {
    //         returnUrl: req.query.returnUrl,
    //     });
    // });

    // expressApp.get('/signup', (req, res) => {
    //     return nextApp.render(req, res, '/signup');
    // });

    // expressApp.get('/me', (req, res) => {
    //     return nextApp.render(req, res, '/me');
    // });

    expressApp.get('/category/:slug', (req, res) => {
        return nextApp.render(req, res, '/category', { slug: req.params.slug });
    });

    expressApp.get('/tag/:slug', (req, res) => {
        return nextApp.render(req, res, '/tag', { slug: req.params.slug });
    });

    expressApp.get('/search', (req, res) => {
        return nextApp.render(req, res, '/search', {
            keyword: '',
        });
    });

    expressApp.get('/search/:keyword', (req, res) => {
        return nextApp.render(req, res, '/search', {
            keyword: req.params.keyword,
        });
    });

    expressApp.get('/post/:slug', (req, res) => {
        return nextApp.render(req, res, '/post', { slug: req.params.slug });
    });

    // expressApp.get('/me/write/:id', (req, res) => {
    //     return nextApp.render(req, res, '/me/write', { id: req.params.id });
    // });

    expressApp.get('*', (req, res) => handle(req, res));

    // seed data
    const { seed } = require('./config/seed');
    seed();

    expressApp.listen(serverPort, () => {
        console.log(`server is running on http://localhost:${serverPort}`);
    });
});
