const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect, // mysql
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max, // 5
        min: dbConfig.pool.min, // 0
        acquire: dbConfig.pool.acquire, // 30000
        idle: dbConfig.pool.idle // 10000
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.roles = require("./role.model.js")(sequelize, Sequelize);
db.tasks = require("./task.model.js")(sequelize, Sequelize);

db.roles.belongsToMany(db.users, {
    through: "user_roles",
});

db.users.belongsToMany(db.roles, {
    through: "user_roles",
});

db.tasks.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "user",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;