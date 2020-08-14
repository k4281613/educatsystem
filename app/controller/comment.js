const Controller = require('egg').Controller;

class CommentController extends Controller {

  async getComment(ctx) {
     const id = ctx.request.body.id;
    const keyword = ctx.request.body.keyword;
    const offset = ctx.request.body.offset - 1;
    const status = ctx.request.body.status;
    const date = ctx.request.body.date;

    const data = await ctx.service.comment.getComment(id, offset, keyword,date, status);
    ctx.body = data;
  }

 async reply(ctx) {
    const id = ctx.request.body.id;
    const content =ctx.request.body.content;
   
    const data = await ctx.service.comment.reply(id,content);
    ctx.body = data;
  }

async getReply(ctx) {
    const id = ctx.query.id;
    const data = await ctx.service.comment.getReply(id);
    ctx.body = data;
  }

}



module.exports = CommentController;
