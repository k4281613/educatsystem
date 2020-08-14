
const multer=require('koa-multer');
const path=require('path');
var sd = require("silly-datetime");

var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/uploads/homework'));
    },
    //修改文件名称
    filename: function (req, file, cb) {
        //console.log(file);
        var fileFormat = (file.originalname).split(".");
        var ran = parseInt(Math.random() * 89 +10);
        var t = sd.format(new Date(),'YYYYMMDDHHmmss');
        cb(null,ran+t + "." + fileFormat[fileFormat.length - 1]);
    }
})
/*//过滤器
   let fileFilter = function(ctx, file ,cb){
        if (file.originalname.split('.').splice(-1) == 'doc'){
            cb(null, true);
        }
    }*/
var upload = multer({
    storage: storage,
    limits:{
        files:1, //一次只允许上传一个文件
        fileSize:1024*1024*15  // 设置文件大小不能超过1000*1024
    },
    // fileFilter: fileFilter
});

module.exports = () => {
    return upload.single('file');
};

