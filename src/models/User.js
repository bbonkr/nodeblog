module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            displayName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(200),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        },
    );

    User.associate = db => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
    };
    return User;
};
