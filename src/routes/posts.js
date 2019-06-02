/**
 * 포스트
 */
const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res, next) => {
    try {
        const limit = (req.query.limit && parseInt(req.query.limit, 10)) || 10;
        const keyword =
            req.query.keyword && decodeURIComponent(req.query.keyword);
        const pageToken =
            (req.query.pageToken && parseInt(req.query.pageToken)) || 0;
        const skip = pageToken ? 1 : 0;

        let where = {};
        if (pageToken) {
            const basisPost = await db.Post.findOne({
                where: {
                    id: pageToken,
                },
            });

            if (basisPost) {
                where = {
                    createdAt: {
                        [db.Sequelize.Op.lt]: basisPost.createdAt,
                    },
                };
            }
        }

        const posts = await db.Post.findAll({
            where: where,
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'displayName'],
                },
                {
                    model: db.Tag,
                    as: 'tags',
                    through: 'PostTag',
                },
                {
                    model: db.Category,
                    as: 'categories',
                    through: 'PostCategory',
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

        return res.json(posts);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.get('/category/:category', async (req, res, next) => {
    try {
        const { category } = req.params;
        const limit = (req.query.limit && parseInt(req.query.limit, 10)) || 10;
        const keyword =
            req.query.keyword && decodeURIComponent(req.query.keyword);
        const pageToken =
            (req.query.pageToken && parseInt(req.query.pageToken)) || 0;
        const skip = pageToken ? 1 : 0;

        let where = {};
        if (pageToken) {
            const basisPost = await db.Post.findOne({
                where: {
                    id: pageToken,
                },
            });

            if (basisPost) {
                where = {
                    createdAt: {
                        [db.Sequelize.Op.lt]: basisPost.createdAt,
                    },
                };
            }
        }

        const posts = await db.Post.findAll({
            where: where,
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'displayName'],
                },
                {
                    model: db.Tag,
                    as: 'tags',
                    through: 'PostTag',
                },
                {
                    model: db.Category,
                    as: 'categories',
                    through: 'PostCategory',
                    where: {
                        slug: category,
                    },
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

        return res.json(posts);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.get('/:slug', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: {
                slug: req.params.slug,
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'displayName'],
                },
                {
                    model: db.Tag,
                    as: 'tags',
                    through: 'PostTag',
                },
                {
                    model: db.Category,
                    as: 'categories',
                    through: 'PostCategory',
                },
            ],
            order: [['createdAt', 'DESC']],
            attributes: [
                'id',
                'title',
                'slug',
                'content',
                'UserId',
                'createdAt',
                'updatedAt',
            ],
        });

        if (post) {
            return res.json(post);
        } else {
            return res.status(404).send('페이지를 찾을 수 없습니다.');
        }
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;
