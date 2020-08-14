'use strict';
const Controller = require('egg').Controller;

class ExperController extends Controller {
    //新建作业
    async addexper() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        // name,course,teacher,semester,week,totaltime,surplustime,fintime,startime
        var totaltime=body.totaltime;//总时间
        const result = await ctx.service.onlineExperTeacher.addexper(body.name,body.course,body.teacher,body.teach_id,body.semester,body.week,totaltime,body.fintime,body.startime);
        ctx.body=result;
    }

    //新建作业问题
    async addquestion() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const result=await ctx.service.onlineExperTeacher.addquestion(body.root_id,body.questions);
        ctx.body=result;
    }

    //查看作业以及问题
    async readexper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body,body.course.length);
        //console.log(Array.isArray(body.course));//判断课程数据是否为数组
        var limit=parseInt(body.limit) || 10;
        var page=parseInt(body.page) || 1;
        const result = await ctx.service.onlineExperTeacher.readexper(body.course,body.teacher,body.semester,body.week,limit,page);
        console.log('查询到'+result.count+'份作业');
        ctx.body=result;
    }

    //更新作业
    async updatexper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        // id,name,week,startime,fintime
        const result = await ctx.service.onlineExperTeacher.updatexper(body.id,body.name,body.week,body.startime,body.fintime,body.totaltime);
        ctx.body=result;
    }

    //更新问题
    async update_question(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        // id,context,obj,type,answer,grade
        const result = await ctx.service.onlineExperTeacher.update_question(body.questions);
        ctx.body=result;
    }

    //删除作业
    async deletexper(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        // id,name,week,startime,fintime
        const result = await ctx.service.onlineExperTeacher.deletexper(body.id,body.name,body.week,body.startime,body.fintime);
        ctx.body=result;
    }

    //删除问题
    async delete_question(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        // id,name,week,startime,fintime
        const result = await ctx.service.onlineExperTeacher.delete_question(body.id);
        ctx.body=result;
    }

    //查看学生作业,用于改作业
    async readStuExper(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        // teacher,semester,course,stuclass,exper_id,limit,page
        var limit=body.limit || 10;
        var page=body.page || 1;
        const result=await ctx.service.onlineExperTeacher.readStuExper(body.stuclass,body.exper_id,limit,page);
        ctx.body = result;
    }

    //作业评分
    async registerScore(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const result=await ctx.service.onlineExperTeacher.registerScore(body.obj,body.id,body.grade);
        ctx.body = result;
    }

    //问题操作，三位一体
    async quest_operation(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const result=await ctx.service.onlineExperTeacher.quest_operation(body.id,body.arr);
        ctx.body = result;
    }
};
module.exports = ExperController;