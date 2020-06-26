const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileAccess = require('./filesystem/fileAccess')
const session = require('express-session');
const passport = require('passport');

const jsonParser = bodyParser.json();
const app = express();

app.use(cors());
app.use(jsonParser);

// Session
app.use(session({
    secret: 'fredofredo',
    resave: false,
    saveUninitialized: true
})); 

// Passport authentication setup.
require('./authorization/auth.js')(passport);
app.use(passport.initialize());
app.use(passport.session());


///////////////////////////////////////////
// Routes
///////////////////////////////////////////


//  Login
//
//  Params: 
//      user 
//      password
//
app.post('/login', passport.authenticate('login-local', {
    successRedirect: '/files',
    failureRedirect: '/unauthorized'
}))


//  Log out
//
app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/unauthorized');
})


//  Directly sets the directory.
//
//  Params:
//      root
//
//  Returns:
//      The name of the new current directory.
//
app.post('/setDirectory', passport.loggedIn(), (req, res) => {
    fileAccess.setDirectory(req.body.root);

    res.send(req.body.root);
})

//  Create new user. Login required.
//
//  Params: 
//      newUser 
//      newPassWord
//
app.post('/newuser', passport.loggedIn(), (req, res) => {
    let userAccess = require('./authorization/useraccess');

    userAccess.createNewUser(req.body.newUser, req.body.newPassWord).then(successful => {
        if (successful) {
            res.send('Success, new user created');
        } else {
            res.send('unable to create new user');
        }
    });
})


// Return all files in the current directory.
//
app.get('/files', passport.loggedIn(), (req, res) => {
    fileAccess.allFiles().then(_result => {
        res.send(_result);
    })
    .catch( err => {
        res.send(err);
    })
})


//  Return a single file
//
//  Params:
//      fileName - res.send will send this file.
//
app.post('/file', passport.loggedIn(), (req, res) => {
    let fileToGet = req.body.fileName;

    fileAccess.file(fileToGet).then(_result => {
        res.send((_result));
    })
    .catch( err => {
        res.send(err);
    })

})


//  Change the file directory.
//
//  Params:
//      newDirectory - A directory.  If new, it will add to
//          the path.  An already existing newDirecory
//          parameter will walk up a directory.
//                      
app.post('/directory', passport.loggedIn(), (req, res) => {
    let _directory = req.body.newDirectory;

    res.send(fileAccess.changeDirectory(_directory));
})


//  Passport 'loggedIn' middleware will forward unathorized
//  visits to restriced routes here.
//
app.get('/unauthorized', (req, res) => {
    res.send("Please log in...")
})


//listen
app.listen(3000, () => {
    console.log('listening....');
})

