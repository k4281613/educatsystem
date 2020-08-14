const Controller = require('egg').Controller;
const qn = require("qn")
const path = require("path")

let client = qn.create({
    accessKey: 'd_LDVatSU5XuJHjwfpS5fmQ9EWd1KuZ81Mbzu4Xj',
    secretKey: '-7MmixF7JQ6I-x1CjfnOKbE1nqPjLb00GsdIUzdB',
    bucket: 'wanger',  // 在七牛云创建的空间名字
    origin: 'media.kaolaplay.com',  // 使用测试域名
    uploadURL:"up-z2.qiniu.com"
});


let qiniuUpload = (filePath) => {
        // key 为上传到七牛云后自定义图片的名称
        return new Promise((resolve, reject) => {
            let fileName = path.win32.basename(filePath);
            client.uploadFile(filePath, {key: fileName}, function (err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
};


class UploadController extends Controller {
   async uploadWork(ctx,next){
      
      let uploadFile = ctx.req.file.path
      
        return qiniuUpload(uploadFile).then((res)=>{
  
             ctx.body={
                data:res
             }
         })
}

}

module.exports = UploadController;
