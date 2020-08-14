const Controller = require('egg').Controller;

class PermissionController extends Controller {

    async getRoles(ctx) { // 获取权限角色列表
        const {token} = ctx.request.body;
        const data = await ctx.service.permission.getRoles(token);
        ctx.body = data;
    }

 async addNewRole(ctx) { // 添加新的权限角色
        const form = ctx.request.body;
        const data = await ctx.service.permission.addNewRole(form);
        ctx.body = data;
    }

async updateRole(ctx) { // 更新权限角色
        const form = ctx.request.body;
        const data = await ctx.service.permission.updateRole(form);
        ctx.body = data;
    }
async deleteRole(ctx) { // 删除权限角色
        const {id} = ctx.request.body;
        const data = await ctx.service.permission.deleteRole(id);
        ctx.body = data;
    }

async getModules(ctx) { // 获取角色模块
        const {id} = ctx.request.body;
        const data = await ctx.service.permission.getModules(id);
        ctx.body = data;
    }

async updateModule(ctx) { // 更新权限模块
        const form = ctx.request.body;
        const data = await ctx.service.permission.updateModule(form);
        ctx.body = data;
    }

async deleteModule(ctx) { // 删除权限模块
        const {id} = ctx.request.body;
        const data = await ctx.service.permission.deleteModule(id);
        ctx.body = data;
    }


async addNewModule(ctx) { // 添加新的权限角色
        const form = ctx.request.body;
        const data = await ctx.service.permission.addNewModule(form);
        ctx.body = data;
    }

async getHandle(ctx) { 
        const {id} = ctx.request.body;
        const data = await ctx.service.permission.getHandle(id);
        ctx.body = data;
    }

async updateHandle(ctx) { 
        const form = ctx.request.body;
        const data = await ctx.service.permission.updateHandle(form);
        ctx.body = data;
    }
async addNewHandle(ctx) { 
        const form = ctx.request.body;
        const data = await ctx.service.permission.addNewHandle(form);
        ctx.body = data;
    }
async deleteHandle(ctx) { 
        const {id} = ctx.request.body;
        const data = await ctx.service.permission.deleteHandle(id);
        ctx.body = data;
    }

async changeHandle(ctx) { 
        const {handles,mid} = ctx.request.body;
        const data = await ctx.service.permission.changeHandle(handles,mid);
        ctx.body = data;
    }


}

module.exports = PermissionController;