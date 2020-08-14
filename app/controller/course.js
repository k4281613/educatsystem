const Controller = require('egg').Controller;
const UploadCourseFile = require('./uploadCourseFile.js');

class CourseController extends Controller {
    async addCourse() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token
        });
        const data = await ctx.service.course.addCourse(params);
        ctx.body = data;
    }

    async getCourseList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token
        });
        const data = await ctx.service.course.getCourseList(params);
        ctx.body = data;
    }

    async deleteCourse() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token
        });
        const data = await ctx.service.course.deleteCourse(params);
        ctx.body = data;
    }

    async getCourseDetail() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.course.getCourseDetail(params);
        ctx.body = data;
    }

    async getStudentList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token
        });
        const data = await ctx.service.course.getStudentList(params);
        ctx.body = data;
    }

    async uploadCourseDesc() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const fileParams = await UploadCourseFile.uploadFile(this);
        const params = Object.assign({}, fileParams, {
            token
        });
        const data = await ctx.service.course.uploadCourseDesc(params);
        ctx.body = data;
    }

    async getStudentCourseList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token
        });
        const data = await ctx.service.course.getStudentCourseList(params);
        ctx.body = data;
    }

    async saveSchoolCourseMessage() {
        const ctx = this.ctx;
        const body = ctx.request.body;
        const data = await ctx.service.course.saveSchoolCourseMessage(body);
        ctx.body = data;
    }
}

module.exports = CourseController;