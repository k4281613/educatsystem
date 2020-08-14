'use strict';
const Controller = require('egg').Controller;

class QuestionController extends Controller{
    async addQuestion(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const result=await ctx.service.experQuestions.addQuestion(body.arr,body.teach_id,body.teacher);
        ctx.body=result;
    }
    async readQuestion(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const limit=body.limit || 10;
        const page=body.page || 1;
        const result=await ctx.service.experQuestions.readQuestion(body.type,body.course,body.Category,limit,page);
        ctx.body=result;
    }
    async updateQuestion(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const result=await ctx.service.experQuestions.updateQuestion(body.id,body.course,body.Category,body.context,body.obj,body.answer,body.grade,body.teach_id,body.teacher);
        ctx.body=result;
    }
    async deleteQuestion(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const result=await ctx.service.experQuestions.deleteQuestion(body.id,body.teach_id,body.teacher);
        ctx.body=result;
    }
    async searchQuestion(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const limit=body.limit || 10;
        const page=body.page || 1;
        const result=await ctx.service.experQuestions.searchQuestion(body.condition,body.type,body.course,body.Category,limit,page);
        ctx.body=result;
    }
    async getCategoryList(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const result=await ctx.service.experQuestions.getCategoryList(body.course);
        ctx.body=result;
    }
    async getmodifyList(){
        const {ctx}=this;
        const {body}=ctx.request;
        console.log(body);
        const limit=body.limit || 10;
        const page=body.page || 1;
        const result=await ctx.service.experQuestions.getmodifyList(body.course,limit,page);
        ctx.body=result;
    }
}
module.exports=QuestionController;