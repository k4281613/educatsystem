const Controller = require('egg').Controller;
const UploadCourseFile = require('./uploadCourseFile.js');

class CourseNoteController extends Controller {
    async addCourseNote() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token
        });
        const data = await ctx.service.courseNote.addCourseNote(params);
        ctx.body = data;
    }

    async deleteCourseNote() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token
        });
        const data = await ctx.service.courseNote.deleteCourseNote(params);
        ctx.body = data;
    }

    async getCourseNoteList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token
        });
        const data = await ctx.service.courseNote.getCourseNoteList(params);
        ctx.body = data;
    }

    async uploadImageOfPublic() {
        const ctx = this.ctx;
        const fileParams = await UploadCourseFile.uploadFile(this);
        ctx.body = {
            status: 1,
            message: 'ok',
            urls: fileParams.file
        };
    }
}

module.exports = CourseNoteController;