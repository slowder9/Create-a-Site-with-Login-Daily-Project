// 1. We're going to make a web server for our twitter clone.
// 2. User login page (html and post request for login)
// 3. Home page

const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session'); // new

const server = express();

const users = [
    { username: 'Erin', password: 'Shaffer', logins: 0 },
    { username: 'Michael', password: 'Robbins', logins: 0 },
    { username: 'Trey', password: 'Wegmann', logins: 0 },
];

const messages = [];

// Configure our server
server.use(bodyparser.urlencoded({ extended: false }));
server.use(session({
    secret: '98rncailevn-_DT83FZ@',
    resave: false,
    saveUninitialized: true
}));

server.engine('mustache', mustache());
server.set('views', './views')
server.set('view engine', 'mustache');

// Set up some routes
server.get('/', function (request, response) {
    response.render('login');
});

server.get('/home', function (request, response) {
    if (request.session.who !== undefined) {
        response.render('home', {
            username: request.session.who.username,
            loginCount: request.session.who.logins,
            messages: messages,
        });
    } else {
        response.redirect('/');
    }
});

server.post('/home', function (request, response) {
    let user = null;

    if (request.body.username === '' || request.body.password === '') {
    response.redirect('/')
    // const message = request.body.msg;
}

for (let i = 0; i < users.length; i++) {
    const username = users[i].username;
    const password = users[i].password;

    if (username === request.body.username && password === request.body.password) {
      user = users[i];
      console.log(user);
    }

    if (user !== null) {
      request.session.who = user;
      request.session.who.logins++;
      response.redirect('/home')
    } else {
      response.redirect('/')
    }
  }
})

server.post('/messages', function (request, response) {
  messages.push({
    msg: request.body.message,
    username: request.session.who.username
  });
  response.redirect('/home');
})

// Run the server
server.listen(3011, function () {
    console.log('Hi');
});