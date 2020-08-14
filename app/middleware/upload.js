const multer = require('koa-multer')
const Promise = require("bluebird")
const path = require("path")
var storage = multer.diskStorage({  
  //文件保存路径  
  destination: function (req, file, cb) {  
    cb(null, path.join(__dirname,'../public/uploads/img'))  
  },  
  //修改文件名称  
  filename: function (req, file, cb) {  
        
    var fileFormat = (file.originalname).split(".");  
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);  
  }  
}) 

var upload = multer({ storage: storage });


module.exports = () => {
  return   upload.single('file')
};