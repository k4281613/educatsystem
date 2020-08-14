'use strict';
const Controller = require('egg').Controller;

class ExperController extends Controller {
    //上传课时作业
    async subexper() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const result = await ctx.service.offlineExperStudent.subexper(body.id,body.name,body.localname,body.localpath,body.webpath,body.submit_time);
        ctx.body=result;
    }

    //查看课时作业
    async readexper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body,body.obj.length);
        //console.log(Array.isArray(body.course));//判断课程数据是否为数组
        var limit=parseInt(body.limit) || 10;
        var page=parseInt(body.page) || 1;
        const result = await ctx.service.offlineExperStudent.readexper(body.obj,body.student,body.stu_id,body.semester,body.week,limit,page);
        ctx.body=result;
    }

};
module.exports = ExperController;