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

        console.log('title', title);
        console.log('slug', slug);
        console.log('markdown', markdown);
        console.log('categories', categories);
        console.log('tags', tags);

        const html = markdownConverter.makeHtml(markdown);
        const text = stripHtml(html);
        const slugEdit = !!slug
            ? slug
            : title.replace(/\s+/g, '-').toLowerCase();

        const post = await db.Post.create({
            title: title,
            slug: slugEdit,
            markdown: markdown,
            content: html,
            contentText: text,
            excerpt: text.slice(0, 200),
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

module.exports = router;
