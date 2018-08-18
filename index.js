//======== Import Required Files ===============
var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var user = require('./models').user;
var roles = require('./models').roles;

var config = require('./config/conf');
//============ Create Express app and initialize to app variable ========
var app = express();
// ============= initialize cros ==============
app.use(cors());
//=========== set port ================
app.set('port',process.env.port || 3000 );
//========= initialize body parser ==========
app.use(bodyparser.json());
//=========== Start Code Here ====================
app.get('/',(req,res)=>{
    res.send({'status':true,'msg':"Server Started."});
});
app.get('/get-users',(req,res)=>{
    user.findAll({ include: [{model:roles} ] }).then(users => {
        res.send({'status':true,'data':users});
    });
});
app.post('/create-user',(req,res)=>{
    var user_data = req.body;
    user.create({
        name:user_data.name,
        email:user_data.email,
        password:user_data.password,
        phone:user_data.phone,
        roleId:user_data.roleId
    }).then((users)=>{
        res.send({'status':true,'msg':users});
    });
});

//======== login =================
app.post('/login',(req,res)=>{
    var name = req.body.name;
    var password = req.body.password;
    user.findOne({ where: {name : name,password : password} }).then(users => {
        if(users){
            const token = jwt.sign({userId : users.id},config.secret,{expiresIn : '24h'});
            res.send({'status' : true, 'message':'sucess', token : token, user : {username:users.name}});
        }else{
            res.send({'status' : false, 'message':'fail'});
        }
      })

});

//============= middle ware ==================
app.use((req,res,next)=>{
    const token = req.headers['auth'];
    if(!token){
        res.send({'status':false,'message':'No autherized.'});
    }else{
        jwt.verify(token,config.secret,(err,decoded)=>{
            if(err){
                res.send({'status':false,'message':'In valid token.'});
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }
});

app.get('/profile',(req,res)=>{
    user.findOne({ where: {id : req.decoded.userId} }).then(users => {
        if(users){
            res.send({'status' : true, 'message':'sucess', data : users});
        }else{
            res.send({'status' : false, 'message':'fail'});
        }
    })
});

//============== Code Ends Here ===================
//====== Start Server ===================
app.listen(app.get('port'),()=>{
    console.log('Server Created in '+app.get('port')+"Port");
});