'use strict';
const Controller = require('egg').Controller;

class ExperController extends Controller {
    //提交在线作业
    async subexper() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        //id,surplus_time,submit_time,questions
        const result = await ctx.service.onlineExperStudent.subexper(body.id,body.status,body.surplus_time,body.submit_time,body.questions);
        ctx.body=result;
    }

    //查看在线作业
    async readexper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body,body.obj.length);
        //console.log(Array.isArray(body.course));//判断课程数据是否为数组
        var limit=parseInt(body.limit) || 10;
        var page=parseInt(body.page) || 1;
        const result = await ctx.service.onlineExperStudent.readexper(body.obj,body.student,body.stu_id,body.semester,body.week,limit,page);
        ctx.body=result;
    }

    async readquestion(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        //学生作业id，教师发布的在线作业id，学生，答案
        var result = await ctx.service.onlineExperStudent.readquestion(body.exper_id);
        ctx.body=result;
    }

    //查看评分后的作业详细问题,作业id
    async read_scored_exper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        var result = await ctx.service.onlineExperStudent.read_scored_exper(body.id,body.exper_id);
        ctx.body=result;
    }

};
module.exports = ExperController;