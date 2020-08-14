'use strict';

const Controller = require('egg').Controller;

class ExperController extends Controller {

    async teachindex(){
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        const result = await ctx.service.experList.teachindex(body.obj,body.teach_id,body.semester);
        ctx.body=result;
    }

    async stuindex(){
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        const result = await ctx.service.experList.stuindex(body.obj,body.stu_id,body.semester);
        ctx.body=result;
    }

    async Geteachlist() {
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        var limit=body.limit || 10;
        var page=body.page || 1;
        var type = body.type || '';
        var result;
        if(type=='online'){
            result = await ctx.service.onlineExperTeacher.readexper(body.course,body.teacher,body.semester,body.week,limit,page);
        }else if(type=='offline'){
            result = await ctx.service.offlineExperTeacher.readexper(body.course,body.teacher,body.semester,body.week,limit,page);
        }else {
            result = await ctx.service.experList.Geteachlist(body.course,body.teacher,body.semester,body.week,limit,page);
        }
        ctx.body=result;
    }

    async Getstulist() {
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        var limit=body.limit || 10;
        var page=body.page || 1;
        const result = await ctx.service.experList.Getstulist(body.course,body.teacher,body.stuclass,body.semester,body.week,limit,page);
        ctx.body=result;
    }

    async read_question(){
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        const result = await ctx.service.experList.read_question(body.exper_id);
        ctx.body=result;
    }

    async TeachSearchexper(){
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        var limit=body.limit || 10;
        var page=body.page || 1;
        const result = await ctx.service.experList.TeachSearchexper(body.condition,body.semester,body.teach_id,limit,page);
        ctx.body=result;
    }

    async SearchStuexper(){
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        var limit=body.limit || 10;
        var page=body.page || 1;
        const result = await ctx.service.experList.SearchStuexper(body.type,body.condition,body.semester,body.course,body.stuclass,body.week,body.exper_id, body.teacher, body.teach_id,limit,page);
        ctx.body=result;
    }

    async Stugetexperlist() {
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        var limit=body.limit || 10;
        var page=body.page || 1;
        var type = body.type || '';
        var result;
        if(type=='online'){
            result = await ctx.service.onlineExperStudent.readexper(body.obj,body.student,body.stu_id,body.semester,body.week,limit,page);
        }else if(type=='offline'){
            result = await ctx.service.offlineExperStudent.readexper(body.obj,body.student,body.stu_id,body.semester,body.week,limit,page);
        }else{
            result = await ctx.service.experList.Stugetexperlist(body.obj,body.student,body.stu_id,body.semester,body.week,limit,page);
        }
        ctx.body=result;
    }

    async StuSearchexper(){
        const {ctx} = this;
        const {body}=ctx.request;
        console.log(body);
        var limit=body.limit || 10;
        var page=body.page || 1;
        const result = await ctx.service.experList.StuSearchexper(body.condition,body.semester,body.stu_id,limit,page);
        ctx.body=result;
    }
}

module.exports = ExperController;
