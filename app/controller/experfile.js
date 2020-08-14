'use strict';
const Controller = require('egg').Controller;
const fs = require('fs');
var qn = require('qn');
const path=require('path');
var client = qn.create({
    accessKey: 'Voa-weDtnRpPIqbyO37ucaNLTGsU_7tA8dladuV-',
    secretKey: 'moQVxM1EQU-ruWSzeI8R_KcGOxsj9O7Ev0v95qbs',
    bucket: 'homework1',
    origin: 'http://poz3immx1.bkt.clouddn.com',
    uploadURL:"up-z2.qiniu.com"
});

class ExperfileController extends Controller {
    //教师批量下载学生文件
    async delfile(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        var mypath=path.join(__dirname,'../public/upload/') + body.filename;
        var result=await ctx.service.experfile.delfile(mypath);
        ctx.body=result;
    }
    async BatchDownload(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        var result=await ctx.service.experfile.BatchDownload(body.arr);
        delete result.path;
        ctx.body=result;
    }//返回路径
    async BatchDownloadStream(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        var result=await ctx.service.experfile.BatchDownload(body.arr);
        //console.log(result);
        const Zip=fs.createReadStream(result.path);
        ctx.attachment(result.filename);
        ctx.set('Content-Type', 'application/octet-stream');
        ctx.body=Zip;
        await ctx.service.experfile.delfile(result.path);
    }//流文件

    //教师重新上传附件
    async reupload() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const obj={};
        obj.pathdata = await ctx.service.experfile.readexper(body.id);
        obj.delresult = await ctx.service.experfile.delfile(obj.pathdata.data[0].localpath);
        console.log(obj,obj.pathdata.data[0].localname);
        if(obj.delresult.status===1){//本地删除
            var UpdateStatus = await ctx.service.experfile.reuploadexper(body.id,body.localpath,body.localname,body.webpath);//数据库更新
            if(UpdateStatus.status===1){
                //七牛云删除
                return new Promise(function(resolve, reject){
                    client.delete(obj.pathdata.data[0].localname, function (err) {
                        if(err){
                            console.log(err);
                            var result={
                                status:1,
                                text:'七牛云原件删除失败,更新失败',
                                err:err
                            };
                            resolve(result);
                        }
                        var result={
                            status:1,
                            text:'七牛云原件删除成功，更新完毕'
                        };
                        console.log(result);
                        resolve(result);
                    })
                }).then(function (res) {
                    ctx.body=res;
                })
            }else {
                ctx.body=UpdateStatus;
            }
        }else{
            var result={
                status:0,
                text:'本地文件更新失败'
            };
            ctx.body=result;
        }
    }
    //学生重新提交附件
    async resubexper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const obj={};
        obj.pathdata = await ctx.service.experfile.readStuexper(body.id);
        console.log(obj.pathdata.status);
        if(obj.pathdata.status===1){
            obj.delresult = await ctx.service.experfile.delfile(obj.pathdata.data[0].localpath);
            console.log(obj,obj.pathdata.data[0].localname);
            if(obj.delresult.status===1){//本地删除
                // id,name,localname,localpath,webpath,submit_time
                var UpdateStatus = await ctx.service.experfile.resubexper(body.id,body.name,body.localname,body.localpath,body.webpath,body.submit_time);//数据库更新
                if(UpdateStatus.status===1){
                    //七牛云删除
                    return new Promise(function(resolve, reject){
                        client.delete(obj.pathdata.data[0].localname, function (err) {
                            if(err){
                                console.log(err);
                                var result={
                                    status:1,
                                    text:'七牛云原件删除失败,重新提交失败',
                                    err:err
                                };
                                resolve(result);
                            }
                            var result={
                                status:1,
                                text:'七牛云原件删除成功，重新提交完毕'
                            };
                            console.log('七牛云原件删除成功，重新提交完毕');
                            resolve(result);
                        })
                    }).then(function (res) {
                        ctx.body=res;
                    })
                }else {
                    ctx.body=UpdateStatus;
                }
            }else{
                var result={
                    status:0,
                    text:'本地文件更新失败'
                };
                ctx.body=result;
            }
        }else {
            var result={
                status:0,
                text:'数据不存在'
            };
            ctx.body=result;
        }

    }
};
module.exports = ExperfileController;