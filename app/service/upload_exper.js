'use strict';
const Controller = require('egg').Controller;
var qn = require('qn');

class UploadController extends Controller {
    async uploadFile(ctx){
        let localpath = ctx.req.file.path;
        let filename=ctx.req.file.filename;
        let originame=ctx.req.file.originalname;
        console.log(localpath,filename,originame);
        //----------------下面开始上传----------------------
        console.log("上传七牛云");
        var client = qn.create({
            accessKey: 'Voa-weDtnRpPIqbyO37ucaNLTGsU_7tA8dladuV-',
            secretKey: 'moQVxM1EQU-ruWSzeI8R_KcGOxsj9O7Ev0v95qbs',
            bucket: 'homework',
            origin: 'http://pndpiua9w.bkt.clouddn.com',
            uploadURL:"up-z2.qiniu.com"
        });
        return new Promise(function(resolve, reject){
            client.uploadFile(localpath, {key: filename}, function (err, result) {
                if(err){
                    console.log(err);
                    resolve(err);
                }else{
                    console.log(result);
                    resolve(result);
                }
            })
        }).then(function (res) {
            res.originame=originame;
            res.localpath=localpath;
            res.filename=filename;
            ctx.body=res;
        })
    }
};
module.exports = UploadController;