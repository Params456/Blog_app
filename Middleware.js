var jwt = require("jsonwebtoken")

module.exports = function callback (req,res,next) {
    var decode = jwt.verify(req.headers.authorization,"secretkey")
    console.log(decode)
    if (decode === "paranthaman19@navgurukul.org"){
        res.status(200)
        next();
    }else{
        res.status(404).json({
            message:"You are not admin.."
        })
    }
}
