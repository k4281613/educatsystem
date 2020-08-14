'use strict';
const Controller = require('egg').Controller;
class PostController extends Controller {
    async listPosts() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        var data = 'get your message'+JSON.stringify(body);
        ctx.body=data;
    }
};
module.exports = PostController;