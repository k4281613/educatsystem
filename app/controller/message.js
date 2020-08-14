
const Controller = require('egg').Controller;

class MessageController extends Controller {


    async getMessage(ctx) {
        const {start,uid} = ctx.request.body
        const data = await ctx.service.message.getMessage(uid,start);
        ctx.body = data;
    }

    async getNewMessage(ctx) {
        const {uid} = ctx.request.body
        const data = await ctx.service.message.getNewMessage(uid);
        ctx.body = data;
    }

async addNewNotice(ctx) {
    const {title, description,time, notice,role} = ctx.request.body;
    const data = await ctx.service.message.addNewNotice(title, description,time, notice,role);
    ctx.body = data;
  }

}

module.exports = MessageController;
