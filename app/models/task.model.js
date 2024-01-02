module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("tasks", {
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        deadline: {
            type: Sequelize.DATE
        }
    });
    return Task;
};