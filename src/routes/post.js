/**
 * 포스트
 */
const express = require('express');
const router = express.Router();
const db = require('../models');
const Sequelize = require('sequelize');
const showdown = require('showdown');
const xssFilter = require('showdown-xss-filter');
const { isLoggedIn } = require('./middleware');
const Op = Sequelize.Op;

const EXCERPT_LENGTH = 200;

const markdownConverter = new showdown.Converter(
    {
        omitExtraWLInCodeBlocks: false,
        noHeaderId: false,
        ghCompatibleHeaderId: true,
        prefixHeaderId: true,
        headerLevelStart: 1,
        parseImgDimensions: true,
        simplifiedAutoLink: true,
        excludeTrailingPunctuationFromURLs: true,
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        ghMentions: false,
        ghMentionsLink: false,
        ghCodeBlocks: true,
        smartIndentationFix: true,
        smoothLivePreview: true,
        disableForced4SpacesIndentedSublists: true,
        simpleLineBreaks: true,
        requireSpaceBeforeHeadingText: true,
        encodeEmails: true,
    },
    {
        extensions: [xssFilter],
    },
);

const stripHtml = html => {
    return html.replace(/(<([^>]+)>)/gi, '');
};

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const { title, slug, markdown, categories, tags } = req.body;

        const html = markdownConverter.makeHtml(markdown);
        const text = stripHtml(html);
        const slugEdit = !!slug
            ? slug
            : title.replace(/\s+/g, '-').toLowerCase();

        const checkPost = await db.Post.where({
            where: { slug: slug, UserId: req.user.id },
        });
        if (!!checkPost) {
            // 동일한 슬러그를 사용할 수 없습니다.
            return res
                .status(400)
                .send(`The [${slug}] post is exists already.`);
        }

        const post = await db.Post.create({
            title: title,
            slug: slugEdit,
            markdown: markdown,
            content: html,
            contentText: text,
            excerpt: text.slice(0, EXCERPT_LENGTH),
            UserId: req.user.id,
        });

        if (categories) {
            const foundCategories = await Promise.all(
                categories.map(v => {
                    return db.Category.findOne({ where: { slug: v.slug } });
                }),
            );

            // await Promise.all(
            //     foundCategories.forEach(v => {
            //         return db.Category.addPost(post);
            //     }),
            // );

            await post.addCategories(foundCategories);
        }

        if (tags) {
            const foundTags = await Promise.all(
                tags.map(v => {
                    return db.Tag.findOrCreate({
                        where: { slug: v.slug },
                        defaults: {
                            slug: v.slug,
                        },
                    });
                }),
            );

            await post.addTags(
                foundTags.map(v => {
                    console.log('tag findOrCreate: ', v);
                    return v[0];
                }),
            );
            // await Promise.all(
            //     foundTags.forEach(v => {
            //         return db.Tag.addPost(post);
            //     }),
            // );
        }

        const newPost = await db.Post.findOne({
            where: {
                id: post.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'displayName'],
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

        return res.json(newPost);
    } catch (e) {
        next(e);
    }
});

router.patch('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await db.Post.findOne({
            where: { id: id, UserId: req.user.id },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'displayName'],
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
            ],
        });

        if (!post) {
            return res
                .status(404)
                .send('Could not find a post. The post may not be yours.');
        }

        const { title, slug, markdown, categories, tags } = req.body;

        const html = markdownConverter.makeHtml(markdown);
        const text = stripHtml(html);
        const slugEdit = !!slug
            ? slug
            : title.replace(/\s+/g, '-').toLowerCase();

        const checkPost = await db.Post.findOne({
            where: {
                slug: slug,
                UserId: req.user.id,
                id: { [Op.ne]: post.id },
            },
            attributes: ['id'],
        });

        if (!!checkPost) {
            // 동일한 슬러그를 사용할 수 없습니다.
            return res
                .status(400)
                .send(`The [${slug}] post is exists already.`);
        }

        await post.update(
            {
                title: title,
                slug: slugEdit,
                markdown: markdown,
                content: html,
                contentText: text,
                excerpt: text.slice(0, EXCERPT_LENGTH),
            },
            {
                fields: [
                    'title',
                    'slug',
                    'markdown',
                    'content',
                    'contentText',
                    'excerpt',
                ],
            },
        );

        if (!!post.Categories) {
            await post.removeCategories(post.Categories.map(c => c.id));
        }

        if (!!post.Tags) {
            await post.removeTags(post.Tags.map(t => t.id));
        }

        if (categories) {
            const foundCategories = await Promise.all(
                categories.map(v => {
                    return db.Category.findOne({ where: { slug: v.slug } });
                }),
            );

            // await Promise.all(
            //     foundCategories.forEach(v => {
            //         return db.Category.addPost(post);
            //     }),
            // );
            console.log('foundCategories: ', foundCategories);

            await post.addCategories(foundCategories);
        }

        if (tags) {
            const foundTags = await Promise.all(
                tags.map(v => {
                    return db.Tag.findOrCreate({
                        where: { slug: v.slug },
                        defaults: {
                            slug: v.slug,
                        },
                    });
                }),
            );

            console.log('foundTags: ', foundTags);

            await post.addTags(
                foundTags.map(v => {
                    console.log('tag findOrCreate: ', v);
                    return v[0];
                }),
            );
            // await Promise.all(
            //     foundTags.forEach(v => {
            //         return db.Tag.addPost(post);
            //     }),
            // );
        }

        const changedPost = await db.Post.findOne({
            where: {
                id: post.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'displayName'],
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

        return res.json(changedPost);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;
