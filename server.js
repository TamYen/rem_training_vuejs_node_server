const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
    // origin: 'http://localhost:8081'
    origin: '*'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// root route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to my application." });
});

require('./app/routes/turorial.routes.js')(app);
require('./app/routes/auth.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/task.routes.js')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require('./app/models/index.js');
const Role = db.roles;
db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and re-sync db.');
    initial();
});

function initial() {
    Role.create({
        id: 1,
        name: 'user'
    });

    Role.create({
        id: 2,
        name: 'moderator'
    });

    Role.create({
        id: 3,
        name: 'admin'
    });
};
