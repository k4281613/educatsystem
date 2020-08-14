const Controller = require('egg').Controller;

class ActivityController extends Controller {
 
async getActivity(ctx) {
    const id = ctx.query.id;
    const keyword = ctx.query.keyword;
    const offset = ctx.query.offset-1;
    const data = await ctx.service.activity.getActivity(id,offset,keyword);
    ctx.body = data;
  }
async delActivity(ctx) {
    const id = ctx.query.id;
    const data = await ctx.service.activity.delActivity(id);
    ctx.body = data;
  }

async getActivityById(ctx) {
     const id = ctx.query.id;
    const data = await ctx.service.activity.getActivityById(id);
    ctx.body = data;
  }

 async addActivityTag(ctx) {
     const activity_id = ctx.query.activity_id;
      const tag = ctx.query.tag;
    const data = await ctx.service.activity.addActivityTag(activity_id,tag);
    ctx.body = data;
  }

async delActivityTag(ctx) {
     const id = ctx.query.id; 
    const data = await ctx.service.activity.delActivityTag(id);
    ctx.body = data;
  }

async addActivity(ctx) {
        
        const content = ctx.request.body.content;
        const addressInfo = ctx.request.body.addressInfo;
       
         const activity = await ctx.service.activity.addActivity(content,addressInfo);
        ctx.body =activity;
    }




}

module.exports =ActivityController;
