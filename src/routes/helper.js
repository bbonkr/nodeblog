const db = require('../models');

exports.findUserById = async id => {
    const me = await db.User.findOne({
        where: {
            id: id,
        },
        include: [
            {
                model: db.Post,
            },
        ],
        attributes: ['id', 'email', 'displayName'],
    });

    return me;
};
