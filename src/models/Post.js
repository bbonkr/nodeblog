module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        'Post',
        {
            title: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(200),
                allowNull: false,
                unique: true,
            },
            markdown: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            excerpt: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        },
    );

    Post.associate = db => {
        db.Post.belongsTo(db.User);
        db.Post.hasMany(db.Comment);
        db.Post.belongsToMany(db.Image, {
            through: 'PostImage',
            as: 'images',
        });
        db.Post.belongsToMany(db.Tag, {
            through: 'PostTag',
            as: 'tags',
        });
        db.Post.belongsToMany(db.Category, {
            through: 'PostCategory',
            as: 'categories',
        });
    };

    return Post;
};
