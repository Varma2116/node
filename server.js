//start server 
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var jwt = require('jsonwebtoken');
const cons = require('consolidate');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.listen(3001,function(){
  console.log("connection established");
})
//mongodb connection
var db 
const MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/'
MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology: true},(err, client) => {
  if (err) return console.log(err)
  console.log('##### database connection successful #####')
  db = client.db('nodeProject')
})
//home page
app.get('/',(req,res)=>{
  res.render('index');
})
//checking login credentials 
app.post('/login',(req,res)=>{
  var query = { "phoneNumber": req.body.phoneNumber, "password": req.body.password };
  db.collection('users').findOne(query, (err, results) => {
    if (err) {
      return console.log(err);
    }
    if (results == null) {
      console.error(new Error(`no user  found`));
      return res.end("No user Found");
    }
    jwt.sign(results, 'secretkey', (err, token) => {
      res.json(token);
    })
  }) 
})
// app.get('/verifyToken',(req,res,next)=>{
//   const header = req.headers['authorization'];
//   if(typeof header != 'undefined'){
//     const data = header.split(" ");
//     req.token = data[1];
//     next();
//   }else{
//     res.sendStatus(403);
//   }
// })
app.get('/loginUser',(req,res)=>{
    res.render("loginUser");
})
//Registeration of user
app.get('/register',(req,res)=>{
  res.render("registerUser");
})
app.post('/submit',(req,res)=>{
  db.collection('users').find({ phoneNumber: req.body.phoneNumber },(err,user)=>{
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Mail exists"
      });
    } else {
        db.collection('users')
          .save(req.body)
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "User created"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
    }
  })
})
app.get('/welcome',(req,res)=>{
    res.render('welcome');
}) 