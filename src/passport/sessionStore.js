module.exports = (sequelize, DataTypes) => {
    const SessionStore = sequelize.define(
        'SessionStore',
        {
            sid: {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            sess: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            expire: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        },
    );

    SessionStore.associate = db => {};

    return SessionStore;
};
