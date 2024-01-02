const controller = require("../controllers/task.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-type, Accept"
        );
        next();
    });

    app.post(
        "/api/task/add",
        controller.create
    );
    app.get(
        "/api/task/all",
        controller.getAll
    );
    app.post(
        "/api/task/changeStatus",
        controller.changeStatus
    );
    app.delete(
        "/api/task/delete/:id",
        controller.delete
    );
};
