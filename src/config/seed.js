const db = require('../models');
const bcrypt = require('bcrypt');

exports.seed = async () => {
    console.log('start to insert seed data.');

    const hasUser = await db.User.findAll({
        attributes: ['id'],
    });

    if (!hasUser || hasUser.length === 0) {
        const testUser = await db.User.create({
            displayName: 'test user',
            email: 'bbon@bbon.kr',
            password: await bcrypt.hash('1234', 12),
        });

        const testCategory = await db.Category.create({
            name: 'test',
            slug: 'test',
            ordinal: 1,
        });

        const testTag = await db.Tag.create({
            name: 'test',
            slug: 'test',
        });

        const testKrTag = await db.Tag.create({
            name: '테스트',
            slug: '테스트',
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
<h2>Lorem Ipsum</h2>
<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula nunc vel leo consequat gravida. Nullam at neque ipsum. Morbi lectus nisi, finibus non nulla efficitur, imperdiet feugiat sapien. Suspendisse potenti. Sed id ultrices tellus. Ut sodales vehicula tellus, pulvinar semper felis cursus a. Nullam odio diam, accumsan at dictum eu, rhoncus in lectus. Nunc iaculis faucibus lectus.</div><div>Nunc ac sapien fringilla, tempus metus in, facilisis erat. In hac habitasse platea dictumst. Sed posuere magna sed ipsum facilisis, at lacinia diam ultrices. Aenean eu nisl sed lectus malesuada rutrum at sit amet tellus. Nunc ut purus purus. Etiam eu scelerisque elit. Sed faucibus ac lectus eu tempor. Maecenas quis neque dui. Phasellus sollicitudin interdum mauris, eu ultrices velit dictum a.</div><div>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra tempus lacus a efficitur. Sed eget nunc magna. Curabitur tincidunt nec nulla et fermentum. Etiam scelerisque aliquam nunc quis dignissim. Aliquam et venenatis lacus. Mauris sagittis, lectus et venenatis auctor, nisl orci tempus diam, semper lobortis lectus massa nec ante. Praesent efficitur faucibus tristique.</div><div>Nullam felis elit, lacinia sit amet luctus ac, molestie ut ipsum. Mauris sodales ultrices sapien ut dapibus. Suspendisse imperdiet nec quam nec commodo. Integer eu orci scelerisque, dignissim massa eu, ornare erat. Maecenas commodo eros id lorem vehicula varius. Mauris sem eros, scelerisque ac maximus consequat, volutpat vel erat. Donec venenatis a nunc at tempor. Donec convallis nulla arcu, eu ultrices nunc finibus et. Maecenas ac elit a purus tempus dictum. Vivamus non tincidunt erat. Sed vitae mi vitae turpis scelerisque tempor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque tincidunt euismod lacinia. Phasellus viverra sapien ut enim cursus, at dignissim libero porttitor.</div><div>Praesent pulvinar arcu non dui auctor aliquet. Vivamus eu molestie nisi. Donec vitae ligula ligula. Cras suscipit egestas neque, eget dignissim eros lacinia sit amet. Etiam in maximus neque, nec blandit elit. Nam quis est tincidunt, dapibus mauris vel, consectetur erat. Nunc euismod, neque ac auctor ullamcorper, eros eros sodales nisl, ac feugiat metus sapien vitae elit. Cras fermentum elit ut mauris maximus hendrerit. Praesent et justo nec nulla sodales pretium non id tellus. Integer lacinia metus ut turpis ultricies, ac feugiat turpis feugiat. Cras tempus dictum nisi. Cras sollicitudin lacus vel urna tincidunt, sit amet sagittis tellus tempus. Morbi porttitor nisi massa, id ornare ante mollis vel. Nam finibus egestas augue eget sollicitudin. Proin et tellus vel libero viverra posuere. Donec porttitor eros ac orci sollicitudin dignissim.</div>
            `,
                contentText: `test ${i +
                    1}샘플문서입니다.Lorem Ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula nunc vel leo consequat gravida. Nullam at neque ipsum. Morbi lectus nisi, finibus non nulla efficitur, imperdiet feugiat sapien. Suspendisse potenti. Sed id ultrices tellus. Ut sodales vehicula tellus, pulvinar semper felis cursus a. Nullam odio diam, accumsan at dictum eu, rhoncus in lectus. Nunc iaculis faucibus lectus.</div><div>Nunc ac sapien fringilla, tempus metus in, facilisis erat. In hac habitasse platea dictumst. Sed posuere magna sed ipsum facilisis, at lacinia diam ultrices. Aenean eu nisl sed lectus malesuada rutrum at sit amet tellus. Nunc ut purus purus. Etiam eu scelerisque elit. Sed faucibus ac lectus eu tempor. Maecenas quis neque dui. Phasellus sollicitudin interdum mauris, eu ultrices velit dictum a.</div><div>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra tempus lacus a efficitur. Sed eget nunc magna. Curabitur tincidunt nec nulla et fermentum. Etiam scelerisque aliquam nunc quis dignissim. Aliquam et venenatis lacus. Mauris sagittis, lectus et venenatis auctor, nisl orci tempus diam, semper lobortis lectus massa nec ante. Praesent efficitur faucibus tristique.</div><div>Nullam felis elit, lacinia sit amet luctus ac, molestie ut ipsum. Mauris sodales ultrices sapien ut dapibus. Suspendisse imperdiet nec quam nec commodo. Integer eu orci scelerisque, dignissim massa eu, ornare erat. Maecenas commodo eros id lorem vehicula varius. Mauris sem eros, scelerisque ac maximus consequat, volutpat vel erat. Donec venenatis a nunc at tempor. Donec convallis nulla arcu, eu ultrices nunc finibus et. Maecenas ac elit a purus tempus dictum. Vivamus non tincidunt erat. Sed vitae mi vitae turpis scelerisque tempor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque tincidunt euismod lacinia. Phasellus viverra sapien ut enim cursus, at dignissim libero porttitor.</div><div>Praesent pulvinar arcu non dui auctor aliquet. Vivamus eu molestie nisi. Donec vitae ligula ligula. Cras suscipit egestas neque, eget dignissim eros lacinia sit amet. Etiam in maximus neque, nec blandit elit. Nam quis est tincidunt, dapibus mauris vel, consectetur erat. Nunc euismod, neque ac auctor ullamcorper, eros eros sodales nisl, ac feugiat metus sapien vitae elit. Cras fermentum elit ut mauris maximus hendrerit. Praesent et justo nec nulla sodales pretium non id tellus. Integer lacinia metus ut turpis ultricies, ac feugiat turpis feugiat. Cras tempus dictum nisi. Cras sollicitudin lacus vel urna tincidunt, sit amet sagittis tellus tempus. Morbi porttitor nisi massa, id ornare ante mollis vel. Nam finibus egestas augue eget sollicitudin. Proin et tellus vel libero viverra posuere. Donec porttitor eros ac orci sollicitudin dignissim.`,
                excerpt: `test ${i + 1} 샘플문서입니다.`,
                UserId: testUser.id,
                createdAt: new Date().setHours(i),
            });
        }

        // 포스트 추가
        const posts = await db.Post.bulkCreate(samplePosts);

        // 분류 추가
        await testCategory.addPosts(posts);

        // 태그 추가
        await testTag.addPosts(posts);

        await testKrTag.addPosts(posts.filter(v => v.id % 2 === 0));
        console.log('insert seed data completed.');
    } else {
        console.log('User is exists. DO NOT SEED DATA.');
    }
};
