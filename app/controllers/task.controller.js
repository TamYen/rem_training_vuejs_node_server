const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Task = db.tasks;

// Op is an object that allows you to use Sequelize operators in your queries.
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    // Create a Task
    const task = {
        title: req.body.title,
        content: req.body.content,
        status: 1,
        user_id: req.body.user_id,
        deadline: req.body.deadline
    };

    // Save Task in the database
    Task.create(task).then(data => {
        res.send('Task created successfully!');
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Task."
        });
    });
}

exports.getAll = (req, res) => {
    Task.findAll().then(data => {
        // convert deadline to YYYY-MM-DD format
        for (let i = 0; i < data.length; i++) {
            data[i].deadline = data[i].deadline.toISOString().slice(0, 10);
        }
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tasks."
        });
    });
}

exports.changeStatus = (req, res) => {
    Task.update({
        status: req.body.status
    }, {
        where: {
            id: req.body.id
        }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "Task status was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error updating Task with id=" + id
        });
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Task.destroy({
        where: {
            id: id
        }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "Task was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Could not delete Task with id=" + id
        });
    });
}

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {
        if (req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
                user.setRoles(roles).then(() => {
                    res.send({
                        message: "User was registered successfully!"
                    });
                });
            });
        } else {
            // user role = 1
            user.setRoles([1]).then(() => {
                res.send({
                    message: "User was registered successfully!"
                });
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({
                message: "User Not Found."
            });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password."
            });
        }

        var token = jwt.sign({
            id: user.id
        }, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400 // 24 hours
        });

        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};
