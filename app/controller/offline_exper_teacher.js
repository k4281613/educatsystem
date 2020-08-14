'use strict';
const Controller = require('egg').Controller;
var qn = require('qn');
var client = qn.create({
    accessKey: 'Voa-weDtnRpPIqbyO37ucaNLTGsU_7tA8dladuV-',
    secretKey: 'moQVxM1EQU-ruWSzeI8R_KcGOxsj9O7Ev0v95qbs',
    bucket: 'homework1',
    origin: 'http://poz3immx1.bkt.clouddn.com',
    uploadURL:"up-z2.qiniu.com"
});
class ExperController extends Controller {
    //新建课时作业
    async addexper() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const result = await ctx.service.offlineExperTeacher.addexper(body.name,body.localname,body.localpath,body.webpath,body.semester,body.week,body.course,body.course_id,body.teacher,body.teach_id,body.fintime,body.startime);
        ctx.body=result;
    }
    //查看课时作业
    async readexper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body,body.course.length);
        //console.log(Array.isArray(body.course));//判断课程数据是否为数组
        var limit=parseInt(body.limit) || 10;
        var page=parseInt(body.page) || 1;
        const result = await ctx.service.offlineExperTeacher.readexper(body.course,body.teacher,body.semester,body.week,limit,page);
        ctx.body=result;
    }
    //更新课时作业
    async updatexper() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        var result = await ctx.service.offlineExperTeacher.updatexper(body.id, body.name, body.week, body.startime, body.fintime);
        ctx.body = result;
    }
    //删除课时作业
    async delexper() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const obj={};
        obj.pathdata = await ctx.service.experfile.readexper(body.id);
        if (obj.pathdata.status===1){
            //console.log(obj,obj.pathdata.data[0].localname);
            obj.delresult = await ctx.service.experfile.delfile(obj.pathdata.data[0].localpath);
        }
        if(obj.delresult.status===1){
            var DeleteStatus = await ctx.service.offlineExperTeacher.delexper(body.id);
            if(DeleteStatus.status===1){
                return new Promise(function(resolve, reject){
                    client.delete(obj.pathdata.data[0].localname, function (err) {
                        if(err){
                            console.log(err);
                            var result={
                                status:0,
                                text:'七牛云删除失败',
                                err:err
                            };
                            resolve(result);
                        }
                        var result={
                            status:1,
                            text:'全部删除成功'
                        };
                        console.log("七牛云删除成功");
                        resolve(result);
                    })
                }).then(function (res) {
                    ctx.body=res;
                })
            }else {
                ctx.body=DeleteStatus;
            }
        }else{

            ctx.body=obj.delresult;
        }
    }

    //查看学生作业,用于评分
    async readStuExper(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        // teacher,semester,course,stuclass,exper_id,limit,page
        var limit=body.limit || 10;
        var page=body.page || 1;
        const result=await ctx.service.offlineExperTeacher.readStuExper(body.stuclass,body.exper_id,limit,page);
        ctx.body = result;
    }

    //作业评分
    async registerScore(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const result=await ctx.service.offlineExperTeacher.registerScore(body.id,body.grade);
        ctx.body = result;
    }
};
module.exports = ExperController;