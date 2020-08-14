const Controller = require('egg').Controller;
class StrategyController extends Controller {
  async addStrategy(ctx) {
    const u_id = ctx.request.body.content.u_id;
    const status = ctx.request.body.content.status ;
    const name = ctx.request.body.content.name;
    const describe = ctx.request.body.content.describe;
    const cover = ctx.request.body.content.cover;
    const sellTime = ctx.request.body.content.sellTime;
    const typeName = ctx.request.body.content.type;
    const type = ctx.request.body.content.strategyType;
    const position = ctx.request.body.address.position;
    const address = ctx.request.body.address.adcode;
    const traffic = ctx.request.body.address.traffic;
    const postTime = Date.now()
    const lat = ctx.request.body.address.lat;
    const lng = ctx.request.body.address.lng;
    
    const user = await ctx.service.strategy.add(u_id,name, describe, cover, position, address, sellTime, traffic, type, typeName, postTime, lat, lng,status);
    ctx.body = user;
  }

async addStrategyDetail(ctx) {
    const  discovery_id = ctx.request.body.discovery_id;
    const content = ctx.request.body.content;
    const data = await ctx.service.strategy.addDetail(discovery_id, content);
    ctx.body = data;
  }

 async getStrategyById(ctx) {
    const id = ctx.query.id;
    const data = await ctx.service.strategy.getStrategyById(id);
    ctx.body = data;
  }


async getStrategy(ctx) {
    const id = ctx.query.id;
    const keyword = ctx.query.keyword;
    const offset = ctx.query.offset-1;
    const data = await ctx.service.strategy.getStrategy(id,offset,keyword);
    ctx.body = data;
  }
async delStrategy(ctx) {
    const id = ctx.query.id;
    const data = await ctx.service.strategy.delStrategy(id);
    ctx.body = data;
  }
  async updateStrategy(ctx) {
     const content = ctx.request.body.content;
    const address = ctx.request.body.address;
    const data = await ctx.service.strategy.updateStrategy(content,address);
    ctx.body = data;
  }
async updateStrategyDetail(ctx) {
    const discovery_id = ctx.request.body.discovery_id;
    
    const content = ctx.request.body.content;
    const data = await ctx.service.strategy.updateDetail(discovery_id, content);
    ctx.body = data;
  }

}

module.exports = StrategyController;
