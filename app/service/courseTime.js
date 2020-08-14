const Service = require('egg').Service;

class CourseTimeService extends Service {
    async createCourseTime(params) {
        const {token, course_id, name} = params;
        const result = await this.app.mysql.insert('course_time', {
            tid: token,
            course_id,
            name,
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

    async deleteCourseTime(params) {
        const {token, id} = params;
        const result = await this.app.mysql.delete('course_time', {
            tid: token,
            id
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

    async getCourseTimeList(params) {
        let {token, role, course_id, offset, limit} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        if (role === 'student') {
            const course = await this.app.mysql.get('student_course', {
                uid: token,
                id: course_id
            });
            token = course ? course['tid'] : null;
            course_id = course ? course['t_course_id'] : null;
        }
        const count = await this.app.mysql.count('course_time', {
            tid: token,
            course_id
        });
        const courseTimeList = await this.app.mysql.select('course_time', {
            where: {
                tid: token,
                course_id
            },
            columns: ['id', 'name', 'created_at'],
            limit: limit,
            offset: offset * limit,
        });
        return {
            status: 1,
            message: 'ok',
            courseTimeList,
            count
        }
    }

    async getCourseTimeDetail(params) {
        const {id} = params;
        const sql = 'select a.name as course_time_name,b.name as course_name,b.code as course_code,a.desc_url,a.desc_text from course_time a,course b where a.id=? and a.course_id=b.id';
        const courseTime = await this.app.mysql.query(sql, [id]);
        return {
            status: 1,
            message: 'ok',
            courseTimeDetail: courseTime.length ? courseTime[0] : null
        }
    }

    async uploadCourseTimeDesc(params) {
        const {token, file, field} = params;
        if (file.length == 0) return {
                status: 0,
                message: 'fail'
        }
        const id = field['id'];
        const desc_url = file[0]['filePath'];
        const result = await this.app.mysql.update('course_time', {
            desc_url
        }, {
            where: {
                tid: token,
                id
            }
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

    async changeCourseTimeDescText(params) {
        const {token, id, content} = params;
        const result = await this.app.mysql.update('course_time', {
            desc_text: content
        }, {
            where: {
                tid: token,
                id
            }
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

    async uploadCourseTimeFile(params) {
        const {file, field, token} = params;
        if (file.length == 0) return {
                status: 0,
                message: 'fail'
        }
        const course_time_id = field['course_time_id'];
        let sql = 'insert into course_file (file_url,file_name,created_at,course_time_id,tid) values ';
        for (let i = 0; i < file.length; i++) {
            let {filePath, fileName} = file[i];
            sql += `('${filePath}','${fileName}',${this.app.mysql.literals.now},'${course_time_id}','${token}'),`;
        }
        sql = sql.substring(0, sql.length - 1);
        const result = await this.app.mysql.query(sql);
        if (result.affectedRows >= 1) {
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

    async deleteCourseTimeFile(params) {
        const {token, id} = params;
        const result = await this.app.mysql.delete('course_file', {
            tid: token,
            id
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

    async getCourseTimeFileList(params) {
        let {course_time_id, offset, limit} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        const count = await this.app.mysql.count('course_file', {
            course_time_id: course_time_id
        });
        const courseTimeFileList = await this.app.mysql.select('course_file', {
            where: {
                course_time_id
            },
            columns: ['id', 'file_url', 'file_name', 'created_at'],
            limit: limit,
            offset: offset * limit,
        });
        return {
            status: 1,
            message: 'ok',
            courseTimeFileList,
            count
        }
    }
}

module.exports = CourseTimeService;