const Service = require('egg').Service;

class CourseNoteService extends Service {
    async addCourseNote(params) {
        const {token, course_id, course_time_id, content} = params;
        const result = await this.app.mysql.insert('course_note', {
            course_id,
            course_time_id,
            content,
            uid: token,
            created_at: this.app.mysql.literals.now
        });
        if (result.affectedRows === 1) {
            return {
                status: 1,
                message: 'ok'
            }
        } else {
            return {
                status: 0,
                message: 'fail'
            }
        }
    }

    async deleteCourseNote(params) {
        const {id, token} = params;
        const result = await this.app.mysql.delete('course_note', {
            id,
            uid: token
        });
        if (result.affectedRows === 1) {
            return {
                status: 1,
                message: 'ok'
            }
        } else {
            return {
                status: 0,
                message: 'fail'
            }
        }
    }


    async getCourseNoteList(params) {
        let {course_id, course_time_id, token, offset, limit} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        let where;
        if (course_time_id) {
            where = {
                course_id,
                course_time_id,
                uid: token
            }
        } else {
            where = {
                course_id,
                uid: token
            }
        }
        const count = await this.app.mysql.count('course_note', where);
        const noteList = await this.app.mysql.select('course_note', {
            where,
            columns: ['id', 'content', 'created_at'],
            limit,
            offset: offset * limit
        });

        return {
            status: 1,
            message: 'ok',
            noteList,
            count
        }
    }
}

module.exports = CourseNoteService;