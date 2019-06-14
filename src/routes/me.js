const router = require('express').Router();
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const { findUserById } = require('./helper');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const { replaceAll } = require('../helpers/stringHelper');

const Op = Sequelize.Op;

const upload = multer({
    storage: multer.diskStorage({
        destination(req, res, done) {
            // 파일 저장 경로
            const mm = moment(Date.now()).format('MM');
            const yyyy = moment(Date.now()).format('YYYY');
            const dest = path.join('uploads', yyyy, mm);
            console.log('destination directory: ', dest);

            fs.exists(dest, exists => {
                if (!exists) {
                    fs.mkdir(dest, { recursive: true }, err => {
                        if (!err) {
                            console.error(err);
                        }
                    });
                }
            });

            done(null, dest);
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            // 저장되는 파일이름
            done(null, `${basename}${new Date().valueOf()}${ext}`);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});

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

/**
 * 나의 글 목록을 가져옵니다.
 * ```
 * query: {
 *      pageToken : string // 목록의 마지막 글의 식별자,
 *      limit: number // 가져올 글의 수,
 *      keyword: string // 검색어,
 * }
 * ```
 */
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

/**
 * 파일 목록을 가져옵니다.
 */
router.get('/media', isLoggedIn, async (req, res, next) => {
    try {
        const { pageToken, keyword, limit } = req.query;
        const recordLimit = parseInt(limit, 10) || 10;
        const skip = pageToken ? 1 : 0;
        let where = { UserId: req.user.id };

        if (pageToken) {
            const id = parseInt(pageToken, 10);
            const latestImage = await db.Image.findOne({ where: { id: id } });
            if (latestImage) {
                Object.assign(where, {
                    id: {
                        [Op.lt]: latestImage.id,
                    },
                });
            }
        }

        if (keyword) {
            Object.assign(where, {
                fileName: {
                    [Op.like]: `%${keyword.trim()}%`,
                },
            });
        }

        const images = await db.Image.findAll({
            where: where,
            attributes: [
                'id',
                'src',
                'fileName',
                'fileExtension',
                'size',
                'contentType',
                'createdAt',
            ],
            order: [['createdAt', 'DESC']],
            limit: recordLimit,
            skip: skip,
        });

        return res.json(images);
    } catch (e) {
        return next(e);
    }
});

/**
 * 파일을 추가합니다.
 */
router.post(
    '/media',
    isLoggedIn,
    upload.array('files'),
    async (req, res, next) => {
        try {
            const images = await Promise.all(
                req.files.map(v => {
                    console.log('file: ', v);

                    const filename = v.originalname;
                    const ext = path.extname(filename);
                    const basename = path.basename(filename, ext);

                    const savedFileExt = path.extname(v.path);
                    const savedFileBasename = encodeURIComponent(
                        path.basename(v.path, savedFileExt),
                    );
                    const savedFileDir = path.dirname(v.path);
                    const serverRootDir = path.normalize(
                        path.join(__dirname, '..'),
                    );
                    const savedFileRelativeDir = path.relative(
                        serverRootDir,
                        savedFileDir,
                    );

                    const src = `/${replaceAll(
                        savedFileRelativeDir,
                        '\\\\',
                        '/',
                    )}/${savedFileBasename}${savedFileExt}`;
                    console.log('file src: ', src);

                    return db.Image.create({
                        src: src,
                        path: `${path.join(serverRootDir, v.path)}`,
                        fileName: basename,
                        fileExtension: ext,
                        size: v.size,
                        contentType: v.mimetype,
                        UserId: req.user.id,
                    });
                }),
            );

            console.log('Promise.all ==> images', images);

            const addedImages = await db.Image.findAll({
                where: {
                    id: {
                        [Op.in]: images.map(v => v.id),
                    },
                },
                attributes: [
                    'id',
                    'src',
                    'fileName',
                    'fileExtension',
                    'size',
                    'contentType',
                    'createdAt',
                ],
            });

            return res.json(addedImages);
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
);

router.delete('/media/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        // const deleteSrc = decodeURIComponent(src);

        const foundImage = await db.Image.findOne({
            where: {
                UserId: req.user.id,
                id: id,
            },
            attributes: [
                'id',
                'path',
                'src',
                'fileName',
                'fileExtension',
                'size',
                'contentType',
                'createdAt',
            ],
        });

        if (!foundImage) {
            return res.status(404).send('Could not find a file.');
        }

        fs.unlinkSync(foundImage.path);

        await foundImage.destroy();

        delete foundImage.path;

        return res.json(foundImage);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;
