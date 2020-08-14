
const Controller = require('egg').Controller;

class MovieController extends Controller {

    async getMovie(ctx) {
        const type = ctx.query.type;
        const keyword = ctx.query.keyword;
        const offset = ctx.query.offset;
        const data = await ctx.service.movie.getMovie(type, offset, keyword);
        ctx.body = data;
    }

 async addMoviePraise(ctx) {
        const {id,uid} = ctx.request.body
       
        const data = await ctx.service.movie.addMoviePraise(uid,id);
        ctx.body = data;
    }

 async addMovieComment(ctx) {

    let mid = ctx.request.body.mid
    let text= ctx.request.body.content
    let avatar = ctx.request.body.avatar
    let name = ctx.request.body.name
    let rateTime = ctx.request.body.rateTime
    let comment_user = ctx.request.body.uid
    let parent_id = ctx.request.body.parent_id
    let to_user = ctx.request.body.to_user_name
    let to_comment = ctx.request.body.to_user_id
     const data = await ctx.service.movie.addMovieComment(mid,text,avatar,name,rateTime,comment_user,parent_id,to_user,to_comment);
     ctx.body = data;
    }


   async getMovieComment(ctx) {
        const id = ctx.query.id;
        const data = await ctx.service.movie.getMovieComment(id);
        ctx.body = data;
    }


   async deleteMovie(ctx) {
        const id = ctx.request.body.id;
        const data = await ctx.service.movie.deleteMovie(id);
        ctx.body = data;
    }

async updateMovie(ctx) {
        const form = ctx.request.body.form;
        const data = await ctx.service.movie.updateMovie(form);
        ctx.body = data;
    }

 

}

module.exports = MovieController;
