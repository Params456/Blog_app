var express = require("express");
var app = express();
var mongoose = require('mongoose');
var book = require("./mongoose");
var Blog = require("./blog")
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var callback = require("./Middleware/Middleware")
var morgan = require("morgan");
app.use(morgan("dev"))

var db = {useNewUrlParser: true,useUnifiedTopology: true}
mongoose.connect('mongodb://localhost/test',db);


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))

function middle (req,res,next) {
    var flag = true
    var decode = jwt.verify(req.headers.authorization,"secretkey")
    book.find({})
    .exec((err,result)=>{
        for (var i of result){
            console.log(result)
            if (decode === i.email){
                flag = false
            }
        }
        if (flag === false){
            next()
        }else{
            res
            .status(404)
            .json({data : "Signup First!"})
        }
    })
}




app.post("/Signup",(req,res)=>{
    book.find({})
    .exec((err,result)=>{
        var flag = true
        for (var i of result){
            if (req.body.email === i.email){
                flag = false
            }
        }
        if (flag){
            book.create(req.body).then((err,profile) => {
                if (err) console.log(err)
                res
                .status(200)
                .json({data:"Inserted"})
            })
        }else{
            res
            .status(404)
            .json({result : "Already Exists!"})
        }
    })


})

app.post("/Login",(req,res)=>{
    book.find({})
    .exec((err,result)=>{
        var flag = true;
        var flag1 = true;
        for (var i of result){
            if (req.body.email === i.email){
                flag = false
            }
            if (req.body.password === i.password){
                flag1 = false
                    that = i
            }
        }
        if (flag && flag1){
            res.status(404).json({message:"Login First!!!"})
        }
        else if (flag == true && flag1 == false){
            res.status(404).json({message:"user is wrong"})
        }
        else if (flag == false && flag1 == true){
            res.status(404).json({message:"password is wrong"})
        }
        else if (flag == false && flag1 == false){
            console.log("login sucessfully")
            jwt.sign(i.email,"secretkey",(err,token)=>{
                if (err) throw err;
                res.status(201).json({
                    token
                })
            }) 
        }
        })
     
    })

app.post("/Post", middle, (req, res) => {
    Blog.create(req.body).then((err, book) => {
        if (err) console.log(err)
        res.send({data : "Inserted"})
    })
})
    

app.get("/getall",middle,(req,res)=>{
    Blog.find({})
    .exec((err,result)=>{
        res
        .status(200)
        .json({data : result})
    })
})

app.get("/get/:email",middle,(req,res)=>{
    Blog.find({email : req.params.email})
    .exec((err,result)=>{
        if (err) throw err;
        res
        .status(200)
        .send(result)
    })
})

app.put("/put/:email",middle,(req,res)=>{
    Blog.findOneAndUpdate({email : req.params.email}, { $set: { Blog : req.body.Blog }},{useFindAndModify: false})
    .exec((err,result)=> {
        if (err) throw err;
        res
        .status(201)
        .json({data:`${req.params.email} is Edited`})
    })
})

app.delete("/delete/:email",middle,(req,res)=>{
    Blog.findOneAndDelete({email : req.params.email},{useFindAndModify: false})
    .exec((err,result)=> {
        if (err) throw err;
        res
        .status(201)
        .json({data:`${req.params.email} is Deleted`})
    })
})




app.use((req,res,next)=>{
    var error = new Error ("Not Found !")
    error.status = 404;
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        message : error.message
    })
})


var port = 3000;
app.listen(port)
console.log(`Server started at ${port}`)