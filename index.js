var Keycloak = require('keycloak-connect');
var express = require('express');
var app = express()
var session = require('express-session');
var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore })

app.use(session({
    secret: 'secret1',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

app.use( keycloak.middleware({ logout: '/logout' }))

app.get('/home', keycloak.protect(), (req, res) => {
    console.log('Home accessed..');

    res.send('Welcome to Home');
});
app.get( '/special', keycloak.protect('special'),(req,res) => {
    console.log("special accessed")
    res.send("User with special role authorized")
});

app.use('/logout', (req, res, next) => {
    req.session.destroy();
    res.clearCookie('connect.sid', { path: '/' });
    return res.redirect("/home"); // optional
});
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

