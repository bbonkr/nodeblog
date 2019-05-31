const db = require('../models');
const bcrypt = require('bcrypt');

exports.seed = async () => {
    const hasUser = await db.User.findAll({
        attributes: ['id'],
    });
    if (!hasUser || hasUser.length === 0) {
        const testUser = await db.User.create({
            displayName: 'test user',
            email: 'bbon@bbon.kr',
            password: await bcrypt.hash('1234', 12),
        });

        const testCatetory = await db.Category.create({
            name: 'test',
            slug: 'test',
            ordinal: 1,
        });

        const samplePosts = [];
        for (let i = 0; i < 10; i++) {
            samplePosts.push({
                title: `Test ${i + 1}`,
                slug: `test-${i + 1}`,
                markdown: `## test ${i + 1}

샘플 문서입니다.
            `,
                content: `<h2>test ${i + 1}</h2>
<p>샘플문서입니다.</p>
            `,
                excerpt: `test ${i + 1} 샘플문서입니다.`,
                UserId: testUser.id,
            });
        }

        await db.Post.bulkCreate(samplePosts);
    }
};
