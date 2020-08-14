const Controller = require('egg').Controller;
const UploadCourseFile = require('./uploadCourseFile.js');

class CourseTimeController extends Controller {
    async createCourseTime() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token
        });
        const data = await ctx.service.courseTime.createCourseTime(params);
        ctx.body = data;
    }

    async deleteCourseTime() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
        });
        const data = await ctx.service.courseTime.deleteCourseTime(params);
        ctx.body = data;
    }

    async getCourseTimeList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseTime.getCourseTimeList(params);
        ctx.body = data;
    }

    async getCourseTimeDetail() {
        const ctx = this.ctx;
        const query = ctx.request.query;
        const data = await ctx.service.courseTime.getCourseTimeDetail(query);
        ctx.body = data;
    }

    async uploadCourseTimeDesc() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const fileParams = await UploadCourseFile.uploadFile(this);
        const params = Object.assign({}, fileParams, {
            token,
        });
        const data = await ctx.service.courseTime.uploadCourseTimeDesc(params);
        ctx.body = data;
    }

    async changeCourseTimeDescText() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
        });
        const data = await ctx.service.courseTime.changeCourseTimeDescText(params);
        ctx.body = data;
    }

    async uploadCourseTimeFile() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const fileParams = await UploadCourseFile.uploadFile(this);
        const params = Object.assign({}, fileParams, {
            token
        });
        const data = await ctx.service.courseTime.uploadCourseTimeFile(params);
        ctx.body = data;
    }

    async deleteCourseTimeFile() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
        });
        const data = await ctx.service.courseTime.deleteCourseTimeFile(params);
        ctx.body = data;
    }

    async getCourseTimeFileList() {
        const ctx = this.ctx;
        const query = ctx.request.query;
        const data = await ctx.service.courseTime.getCourseTimeFileList(query);
        ctx.body = data;
    }
}

module.exports = CourseTimeController;