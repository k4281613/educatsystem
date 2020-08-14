const Controller = require('egg').Controller;

class GraduationController extends Controller {

  async getGraduationWork(ctx) {
    const {u_id,name,page,size} = ctx.request.body
    const data = await ctx.service.graduation.getGraduationWork(u_id,name,page,size);
    ctx.body = data;
  }

async choiceGraduationWork(ctx) {
    const {u_id,cid} = ctx.request.body
    const data = await ctx.service.graduation.choiceGraduationWork(u_id,cid);
    ctx.body = data;
  }
 


async addGraduationWork(ctx) {
    const { uid,major, tid,username , title, description,time} = ctx.request.body
    const data = await ctx.service.graduation.addGraduationWork(uid, major, tid ,username , title, description,time);
    ctx.body = data;
  }


 async getMissionStart(ctx) {
    const {year,token,type} = ctx.request.body
    const data = await ctx.service.graduation.getMissionStart(year,token,type);
    ctx.body = data;
  }

 async submitWeekReport(ctx) {

    const { token,time,week,status,content,save,more_time,type} = ctx.request.body

    const data = await ctx.service.graduation.submitWeekReport(token,time,week,status,content,save,more_time,type);
    ctx.body = data;
  }


 
  async getWeekReport(ctx) {
    const token = ctx.request.body.token
    const data = await ctx.service.graduation.getWeekReport(token);
    ctx.body = data;
  }

 async getMyMission(ctx) {

    const {token, page, size}= ctx.request.body
    
    const data = await ctx.service.graduation.getMyMission(token, page, size);
    ctx.body = data;
  }

  async completeMission(ctx) {
    
     const {id, token, file} = ctx.request.body

    const data = await ctx.service.graduation.completeMission(id, token, file);
    ctx.body = data;
  }

 async submitMyPapper(ctx) {
    
     const { tid, uid,time, file} = ctx.request.body

    const data = await ctx.service.graduation.submitMyPapper( tid, uid,time, file);
    ctx.body = data;
  }
 async getMyPapper(ctx) {
    
     const {uid,size,page,year} = ctx.request.body

    const data = await ctx.service.graduation.getMyPapper(uid,size,page,year);
    ctx.body = data;
  }

}


module.exports = GraduationController;
