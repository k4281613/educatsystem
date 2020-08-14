const Controller = require('egg').Controller;
class UserController extends Controller {
  async refreshCourse(ctx) {
      
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    
    const user = await ctx.service.user.refreshCourse(username,password);
   
    ctx.body = user;
  };
 async info(ctx) {
    const {token,role} = ctx.request.body;
    const user = await ctx.service.user.getInfo(token,role);
    ctx.body = user;
  }




async getTeamList(ctx) {
    const id = ctx.query.id;
    const user = await ctx.service.user.getTeamList(id);
    ctx.body = user;
  }

async getContentDetail(ctx) {
    const id = ctx.query.id;
    const user = await ctx.service.user.getContentDetail(id);
    ctx.body = user;
  }


async getWeekReport(ctx) {
    const team_id = ctx.query.team_id;
    const user = await ctx.service.user.getWeekReport(team_id);
    ctx.body = user;
  }


async updateWork(ctx) {
    const sid = ctx.query.sid;
    const type = ctx.query.type;
    const url = ctx.query.url;
    const team_id = ctx.query.team_id;
    const name= ctx.query.name;
    const text= ctx.query.text;


    const user = await ctx.service.user.updateWork(sid,type,url,team_id,name,text)
    ctx.body = user;
  }

  async addWeekReport(ctx) {
    const uid = ctx.query.uid;
    const name = ctx.query.name;
    const content = ctx.query.content;
    const postTime = ctx.query.postTime;
    const team_id = ctx.query.team_id;
    const user = await ctx.service.user.addWeekReport(uid, name, content, postTime,team_id);
    ctx.body = user;
  }


  async getHistory(ctx) {
    const team_id = ctx.query.team_id;
    const user = await ctx.service.user.getHistory(team_id);
    ctx.body = user;
  }


async siseLogin(ctx) {
   
     const {ip,username,password} = ctx.request.body
    const data = await ctx.service.user.siseLogin(ip,username,password);
    ctx.body = data;
  }

async unlock(ctx) {
   
     const {token,username,password,role} = ctx.request.body
    const data = await ctx.service.user.unlock(token,username,password,role);
    ctx.body = data;
  }


 async chatinfo(ctx) {
    const id = ctx.query.id;
    const user = await ctx.service.user.getChatInfo(id);
    ctx.body = user;
  }
 async logout(ctx) {
    const token = ctx.query.token;
    const user = await ctx.service.user.logout(token);
    ctx.body = user;
  }

 async updateInfo(ctx) {
    const {token,role,content,type} = ctx.request.body
    const user = await ctx.service.user.updateInfo(token,role,content,type);
    ctx.body = user;
  }

}

module.exports = UserController;
