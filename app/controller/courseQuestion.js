const Controller = require('egg').Controller;

class CourseQuestionController extends Controller {
    async addCourseQuestion() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token
        });
        const data = await ctx.service.courseQuestion.addCourseQuestion(params);
        ctx.body = data;
    }

    async addCourseQuestionReply() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.addCourseQuestionReply(params);
        ctx.body = data;
    }

    async addCourseQuestionReplyComment() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.addCourseQuestionReplyComment(params);
        ctx.body = data;
    }

    async getCurrentCourseQuestionList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getCurrentCourseQuestionList(params);
        ctx.body = data;
    }

    async getCurrentCourseQuestionListNoAudit() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getCurrentCourseQuestionListNoAudit(params);
        ctx.body = data;
    }

    async getCourseQuestionList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getCourseQuestionList(params);
        ctx.body = data;
    }

    async deleteCourseQuestion() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.deleteCourseQuestion(params);
        ctx.body = data;
    }

    async deleteCourseQuestionReply() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.deleteCourseQuestionReply(params);
        ctx.body = data;
    }

    async deleteCourseQuestionComment() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.deleteCourseQuestionComment(params);
        ctx.body = data;
    }

    async getCourseQuestionDetail() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getCourseQuestionDetail(params);
        ctx.body = data;
    }

    async changeCourseQuestionStatus() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.changeCourseQuestionStatus(params);
        ctx.body = data;
    }

    async changeCourseQuestionReplyStatus() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.changeCourseQuestionReplyStatus(params);
        ctx.body = data;
    }

    async getHasRepliedQuestionList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getHasRepliedQuestionList(params);
        ctx.body = data;
    }

    async getHasCommentedQuestionList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getHasCommentedQuestionList(params);
        ctx.body = data;
    }

    async getMyCourseQuestionList() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getMyCourseQuestionList(params);
        ctx.body = data;
    }

    async auditCourseQuestion() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.auditCourseQuestion(params);
        ctx.body = data;
    }

    async updateAuditFailCourseQuestion() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.updateAuditFailCourseQuestion(params);
        ctx.body = data;
    }


    async getCourseQuestionNotify() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.getCourseQuestionNotify(params);
        ctx.body = data;
    }

    async hasNewCourseQuestionNotify() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const query = ctx.request.query;
        const params = Object.assign({}, query, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.hasNewCourseQuestionNotify(params);
        ctx.body = data;
    }

    async setCourseQuestionNotify() {
        const ctx = this.ctx;
        const token = ctx.request.header.token;
        const role = ctx.request.header.role;
        const body = ctx.request.body;
        const params = Object.assign({}, body, {
            token,
            role
        });
        const data = await ctx.service.courseQuestion.setCourseQuestionNotify(params);
        ctx.body = data;
    }

}

module.exports = CourseQuestionController;