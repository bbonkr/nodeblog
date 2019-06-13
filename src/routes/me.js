const router = require('express').Router();
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const { findUserById } = require('./helper');

const Op = Sequelize.Op;

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const me = await findUserById(req.user.id);

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

router.get('/post/:id', isLoggedIn, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id || '0', 10);

        const post = await db.Post.findOne({
            where: { id: id, UserId: req.user.id },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'email', 'displayName'],
                },
                {
                    model: db.Tag,
                    as: 'Tags',
                    through: 'PostTag',
                },
                {
                    model: db.Category,
                    as: 'Categories',
                    through: 'PostCategory',
                },
                {
                    model: db.PostAccessLog,
                    attributes: ['id'],
                },
            ],
            attributes: [
                'id',
                'title',
                'slug',
                'markdown',
                'UserId',
                'createdAt',
                'updatedAt',
            ],
        });

        if (!post) {
            return res.status(404).send('Could not find a post.');
        }

        return res.json(post);
    } catch (e) {
        // console.error(e);
        return next(e);
    }
});

router.get('/posts', isLoggedIn, async (req, res, next) => {
    try {
        const limit = (req.query.limit && parseInt(req.query.limit, 10)) || 10;
        const keyword =
            req.query.keyword && decodeURIComponent(req.query.keyword);
        const pageToken =
            (req.query.pageToken && parseInt(req.query.pageToken)) || 0;
        const skip = pageToken ? 1 : 0;

        let where = { UserId: req.user.id };

        if (keyword) {
            Object.assign(where, {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    {
                        content: {
                            [Op.like]: `%${keyword}%`,
                        },
                    },
                ],
            });
        }

        const postsCount = await db.Post.findAll({
            where: where,
            attributes: ['id'],
        });

        if (pageToken) {
            const basisPost = await db.Post.findOne({
                where: {
                    id: pageToken,
                },
            });

            if (basisPost) {
                Object.assign(where, {
                    createdAt: {
                        [db.Sequelize.Op.lt]: basisPost.createdAt,
                    },
                });
                // where = {
                //     createdAt: {
                //         [db.Sequelize.Op.lt]: basisPost.createdAt,
                //     },
                // };
            }
        }

        const posts = await db.Post.findAll({
            where: where,
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'email', 'displayName'],
                },
                {
                    model: db.Tag,
                    as: 'Tags',
                    through: 'PostTag',
                },
                {
                    model: db.Category,
                    as: 'Categories',
                    through: 'PostCategory',
                },
                {
                    model: db.PostAccessLog,
                    attributes: ['id'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: limit,
            skip: skip,
            attributes: [
                'id',
                'title',
                'slug',
                'excerpt',
                'UserId',
                'createdAt',
                'updatedAt',
            ],
        });

        return res.json({ posts, postsCount: postsCount.length || 0 });
    } catch (e) {
        return next(e);
    }
});

router.get('/media', isLoggedIn, async (req, res, next) => {
    try {
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
