const Service = require('egg').Service;

class CourseQuestionService extends Service {
    async addCourseQuestion(params) {
        const {token, title, content, course_id} = params;
        const user = await this.app.mysql.get('system_user', {
            u_id: token
        });
        const course = await this.app.mysql.get('student_course', {
            id: course_id
        });
        const username = user['username'];
        const number = user['stu_number'];
        const year = course['year'];
        const semester = course['semester'];
        const course_name = course['name'];
        const course_code = course['code'];
        const course_classes = course['classes'];
        const t_course_id = course['t_course_id'];
        const result = await this.app.mysql.insert('course_question', {
            title,
            content,
            year,
            semester,
            course_id: t_course_id,
            course_name,
            course_code,
            course_classes,
            username,
            number,
            status: 'unsolved',
            created_at: this.app.mysql.literals.now,
            uid: token,
            audit_status: 'ing'
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

    async addCourseQuestionReply(params) {
        const {role, token, content, question_id} = params;
        const table = role === 'student' ? 'system_user' : 'teacher';
        const user = await this.app.mysql.get(table);
        const username = user.username;
        const courseQuestion = await this.app.mysql.get('course_question', {
            id: question_id
        });
        const {audit_status} = courseQuestion;
        if (audit_status === 'ing' || audit_status === 'fail') {
            return {
                status: 0,
                message: 'fail'
            }
        }
        const result1 = await this.app.mysql.insert('course_question_notify', {
            from_user_name: username,
            from_user_role: role,
            from_user_content: content,
            to_user_name: courseQuestion['username'],
            to_user_role: 'student',
            to_user_content: courseQuestion['title'],
            has_read: 0,
            created_at: this.app.mysql.literals.now
        });
        const result2 = await this.app.mysql.insert('course_question_reply', {
            username,
            role,
            uid: token,
            content,
            status: 'general',
            created_at: this.app.mysql.literals.now,
            question_id
        });
        if (result1.affectedRows === 1 && result2.affectedRows === 1) {
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

    async addCourseQuestionReplyComment(params) {
        const {token, role, content, from_user_name, to_user_name, to_user_role, to_user_content, question_id, reply_id} = params;
        const courseQuestion = await this.app.mysql.get('course_question', {
            id: question_id
        });
        const {audit_status} = courseQuestion;
        if (audit_status === 'ing' || audit_status === 'fail') {
            return {
                status: 0,
                message: 'fail'
            }
        }
        const reply = await this.app.mysql.get('course_question_reply', {
            id: reply_id
        });
        await this.app.mysql.insert('course_question_notify', {
            from_user_name,
            from_user_role: role,
            from_user_content: content,
            to_user_name: reply['username'],
            to_user_role: reply['role'],
            to_user_content: reply['content'],
            has_read: 0,
            created_at: this.app.mysql.literals.now
        });
        if (to_user_name && to_user_role && to_user_content) {
            await this.app.mysql.insert('course_question_notify', {
                from_user_name,
                from_user_role: role,
                from_user_content: content,
                to_user_name: to_user_name,
                to_user_role: reply['role'],
                to_user_content,
                has_read: 0,
                created_at: this.app.mysql.literals.now
            });
        }
        const result = await this.app.mysql.insert('course_question_comment', {
            content,
            from_user_name,
            from_user_role: role,
            to_user_name: to_user_name ? to_user_name : null,
            to_user_role: to_user_role ? to_user_role : null,
            reply_id,
            created_at: this.app.mysql.literals.now,
            from_user_id: token,
            question_id
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

    async getCurrentCourseQuestionList(params) {
        let {course_id, offset, limit, role, token} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        if (role === 'student') {
            const course = await this.app.mysql.get('student_course', {
                id: course_id,
            });
            course_id = course.t_course_id
        }
        const count = await this.app.mysql.count('course_question', {
            course_id,
            audit_status: 'success'
        });
        const questionList = await this.app.mysql.select('course_question', {
            where: {
                course_id,
                audit_status: 'success'
            },
            columns: ['id', 'title', 'username', 'number', 'created_at', 'status', 'audit_status', 'uid'],
            orders: [['created_at', 'desc']],
            limit: limit,
            offset: offset * limit,
        });
        let list = [];
        for (let i = 0; i < questionList.length; i++) {
            const {id, title, username, number, created_at, status, audit_status, uid} = questionList[i];
            const is_self = token === uid ? true : false;
            list.push({
                id,
                title,
                username,
                number,
                created_at,
                status,
                audit_status,
                is_self
            })
        }
        return {
            status: 1,
            message: 'ok',
            questionList: list,
            count
        }
    }

    async getCurrentCourseQuestionListNoAudit(params) {
        let {course_id, offset, limit, role, token} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        let where;
        if (role === 'student') {
            const course = await this.app.mysql.get('student_course', {
                id: course_id,
            });
            course_id = course.t_course_id;
            where = {
                course_id,
                uid: token,
                audit_status: ['fail', 'ing']
            }
        } else {
            where = {
                course_id,
                audit_status: ['fail', 'ing']
            }
        }
        const count = await this.app.mysql.count('course_question', where);
        const questionList = await this.app.mysql.select('course_question', {
            where,
            columns: ['id', 'title', 'username', 'number', 'created_at', 'status', 'audit_status'],
            orders: [['created_at', 'desc']],
            limit: limit,
            offset: offset * limit,
        });
        return {
            status: 1,
            message: 'ok',
            questionList,
            count
        }
    }

    async getCourseQuestionList(params) {
        let {year, semester, course_name, offset, limit, token} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        const where = !course_name ? {
            year,
            semester,
            audit_status: 'success'
        } : {
            year,
            semester,
            course_name,
            audit_status: 'success'
        };
        const count = await this.app.mysql.count('course_question', where);
        const questionList = await this.app.mysql.select('course_question', {
            where,
            columns: ['id', 'title', 'course_name', 'course_code', 'course_classes', 'username', 'number', 'created_at', 'status', 'audit_status', 'uid'],
            orders: [['created_at', 'desc']],
            limit: limit,
            offset: offset * limit,
        });
        let list = [];
        for (let i = 0; i < questionList.length; i++) {
            const {id, title, course_name, course_code, course_classes, username, number, created_at, status, audit_status, uid} = questionList[i];
            const is_self = token === uid ? true : false;
            list.push({
                id,
                title,
                course_name,
                course_code,
                course_classes,
                username,
                number,
                created_at,
                status,
                audit_status,
                is_self
            })
        }
        return {
            status: 1,
            message: 'ok',
            questionList: list,
            count
        }
    }

    async deleteCourseQuestion(params) {
        const {id, token, role} = params;
        let where;
        if (role === 'student') {
            where = {
                id,
                uid: token
            }
        } else {
            where = {
                id
            }
        }
        const result = await this.app.mysql.delete('course_question', where);
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

    async deleteCourseQuestionReply(params) {
        const {id, token, role} = params;
        const result = await this.app.mysql.delete('course_question_reply', {
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

    async deleteCourseQuestionComment(params) {
        const {id, token, role} = params;
        const result = await this.app.mysql.delete('course_question_comment', {
            id,
            from_user_id: token
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
    async getCourseQuestionDetail(params) {
        const {id, token} = params;
        let questionDetail = {}
        const question = await this.app.mysql.select('course_question', {
            where: {
                id
            },
            columns: ['id', 'title', 'content', 'course_name', 'course_code', 'course_classes', 'username', 'number', 'status', 'audit_status', 'created_at']
        });
        if (question.length) {
            questionDetail = question[0];
            const mysql = `select a.id as a_id,a.content as a_content,a.username,a.role,a.status,a.uid,a.created_at as a_created_at,b.id as b_id,b.reply_id,b.content as b_content,b.from_user_name,b.from_user_role,b.to_user_name,b.to_user_role,b.created_at as b_created_at,b.from_user_id from course_question_reply a left join course_question_comment b on a.id = b.reply_id where a.question_id=? order by field(a.status,'best','useful','general') asc,field(a.role,'admin','teacher','student') asc`;
            const result = await this.app.mysql.query(mysql, [id]);
            questionDetail['replyList'] = [];
            const {replyList} = questionDetail;
            result.forEach(item => {
                const {a_id, a_content, username, role, status, uid, a_created_at, b_id, reply_id, b_content, from_user_name, from_user_role, to_user_name, to_user_role, b_created_at, from_user_id} = item;
                if (replyList.length === 0 || (replyList.length > 0 && replyList[replyList.length - 1]['id'] !== a_id)) {
                    replyList.push({
                        id: a_id,
                        content: a_content,
                        username,
                        role,
                        status,
                        is_self: uid === token ? true : false,
                        created_at: a_created_at,
                        commentList: []
                    });
                }
                for (let i = 0; i < replyList.length; i++) {
                    if (reply_id === replyList[i]['id']) {
                        replyList[i]['commentList'].push({
                            id: b_id,
                            content: b_content,
                            from_user_name,
                            from_user_role,
                            to_user_name,
                            to_user_role,
                            is_self: from_user_id === token ? true : false,
                            created_at: b_created_at
                        })
                        break;
                    }
                }
            });
        }
        // const mysql = 'select c.reply_uid,c.id,c.title,c.course_name,c.course_code,c.course_classes,c.username,c.number,c.created_at,c.status,c.audit_status,c.content,c.reply_id,c.reply_username,c.role,c.reply_created_at,c.reply_content,c.reply_status,d.id as comment_id,d.content as comment_content,d.from_user_name,d.from_user_role,d.to_user_name,d.to_user_role,d.created_at as comment_created_at,d.reply_id as comment_reply_id,d.from_user_id from (select a.id,a.title,a.course_name,a.course_code,a.course_classes,a.username,a.number,a.created_at,a.status,a.audit_status,a.content,b.id as reply_id,b.username as reply_username,b.role,b.created_at as reply_created_at,b.content as reply_content,b.status as reply_status,b.uid as reply_uid from course_question a left join course_question_reply b on a.id=b.question_id where a.id=?) c left join course_question_comment d on c.reply_id = d.reply_id order by d.created_at desc';
        // const result = await this.app.mysql.query(mysql, [id]);
        // let questionDetail = {},
        //     level2 = [],
        //     level3 = [];
        // for (var i = 0; i < result.length; i++) {
        //     var item = result[i];
        //     const {from_user_id, reply_uid, id, title, course_name, course_code, course_classes, username, number, created_at, status, audit_status, content, reply_id, reply_username, role, reply_created_at, reply_content, reply_status, comment_id, comment_content, from_user_name, from_user_role, to_user_name, to_user_role, comment_created_at, comment_reply_id} = item;
        //     if (!questionDetail['id']) {
        //         questionDetail['id'] = id;
        //         questionDetail['title'] = title;
        //         questionDetail['course_name'] = course_name;
        //         questionDetail['course_code'] = course_code;
        //         questionDetail['course_classes'] = course_classes;
        //         questionDetail['username'] = username;
        //         questionDetail['number'] = number;
        //         questionDetail['created_at'] = created_at;
        //         questionDetail['status'] = status;
        //         questionDetail['audit_status'] = audit_status;
        //         questionDetail['content'] = content;
        //         questionDetail['replyList'] = [];
        //     }
        //     const replyList = questionDetail['replyList'];
        //     if ((reply_id && replyList.length === 0) || (replyList.length > 0 && replyList[replyList.length - 1]['id'] !== reply_id)) {
        //         replyList.push({
        //             id: reply_id,
        //             username: reply_username,
        //             role: role,
        //             created_at: reply_created_at,
        //             content: reply_content,
        //             status: reply_status,
        //             is_self: reply_uid === token ? true : false,
        //             commentList: []
        //         });
        //     }
        //     for (var j = 0; j < replyList.length; j++) {
        //         if (comment_reply_id === replyList[j]['id']) {
        //             replyList[j]['commentList'].push({
        //                 id: comment_id,
        //                 content: comment_content,
        //                 from_user_name,
        //                 from_user_role,
        //                 to_user_name,
        //                 to_user_role,
        //                 is_self: from_user_id === token ? true : false,
        //                 created_at: comment_created_at,
        //             });
        //             break;
        //         }
        //     }
        // }

        return {
            status: 1,
            message: 'ok',
            questionDetail
        }
    }

    async changeCourseQuestionStatus(params) {
        const {id, status, role, token} = params;
        const where = role === 'student' ? {
            uid: token,
            id
        } : {
            id
        };
        const result = await this.app.mysql.update('course_question', {
            status
        }, {
            where
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

    async changeCourseQuestionReplyStatus(params) {
        const {id, status, token, role} = params;
        let where;
        const reply = await this.app.mysql.get('course_question_reply', {
            id
        });
        const question = await this.app.mysql.get('course_question', {
            id: reply['question_id']
        });
        if (question['uid'] === token) {
            where = {
                uid: reply['uid'],
                id
            }
        } else {
            where = {
                uid: token,
                id
            }
        }

        const result = await this.app.mysql.update('course_question_reply', {
            status
        }, {
            where
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

    async getHasRepliedQuestionList(params) {
        let {token, year, semester, offset, limit} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        let count,
            sql,
            hasRepliedQuestionList;
        if (year && semester) {
            sql = 'select count(*) as count from course_question a,course_question_reply b where b.uid=? and b.question_id=a.id and a.year=? and a.semester=?';
            count = await this.app.mysql.query(sql, [token, year, semester]);
            count = count[0]['count'];
            sql = 'select a.id as question_id,b.id as reply_id,a.course_name,a.title as question_title,b.content as reply_content,b.created_at from course_question a,course_question_reply b where b.uid=? and b.question_id=a.id and a.year=? and a.semester=? order by b.created_at desc  limit ?,?';
            hasRepliedQuestionList = await this.app.mysql.query(sql, [token, year, semester, offset, limit]);
        } else {
            count = await this.app.mysql.count('course_question_reply', {
                uid: token
            });
            sql = 'select a.id as question_id,b.id as reply_id,a.course_name,a.title as question_title,b.content as reply_content,b.created_at from course_question a,course_question_reply b where b.uid=? and b.question_id=a.id order by b.created_at desc  limit ?,?';
            hasRepliedQuestionList = await this.app.mysql.query(sql, [token, offset * limit, limit]);
        }

        return {
            status: 1,
            message: 'ok',
            hasRepliedQuestionList,
            count
        }
    }

    async getHasCommentedQuestionList(params) {
        let {token, year, semester, offset, limit} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        let count,
            sql,
            hasCommentedQuestionList;
        if (year && semester) {
            sql = 'select count(*) as count from course_question a,course_question_comment b where b.from_user_id=? and b.question_id=a.id and a.year=? and a.semester=?';
            count = await this.app.mysql.query(sql, [token, year, semester]);
            count = count[0]['count'];
            sql = 'select b.question_id,b.reply_id,b.id as comment_id,a.course_name,a.title as question_title,b.content as comment_content,b.created_at from course_question a,course_question_comment b where b.from_user_id=? and b.question_id=a.id and a.year=? and a.semester=? order by b.created_at desc  limit ?,?';
            hasCommentedQuestionList = await this.app.mysql.query(sql, [token, year, semester, offset, limit]);
        } else {
            count = await this.app.mysql.count('course_question_comment', {
                from_user_id: token
            });
            sql = 'select b.question_id,b.reply_id,b.id as comment_id,a.course_name,a.title as question_title,b.content as comment_content,b.created_at from course_question a,course_question_comment b where b.from_user_id=? and b.question_id=a.id order by b.created_at desc  limit ?,?';
            hasCommentedQuestionList = await this.app.mysql.query(sql, [token, offset * limit, limit]);
        }

        return {
            status: 1,
            message: 'ok',
            hasCommentedQuestionList,
            count
        }
    }

    async getMyCourseQuestionList(params) {
        const {token, year, semester, offset, limit} = params;
        let where;
        if (year && semester) {
            where = {
                year,
                semester,
                uid: token
            }
        } else {
            where = {
                uid: token
            }
        }
        const count = await this.app.mysql.count('course_question', where);
        const questionList = await this.app.mysql.select('course_question', {
            where,
            columns: ['id', 'title', 'course_name', 'course_code', 'course_classes', 'username', 'number', 'created_at', 'status', 'audit_status'],
            orders: [['created_at', 'desc']],
            limit: limit,
            offset: offset * limit,
        });
        return {
            status: 1,
            message: 'ok',
            questionList,
            count
        }
    }

    async auditCourseQuestion(params) {
        const {question_id, audit_status} = params;
        const result = await this.app.mysql.update('course_question', {
            audit_status
        }, {
            where: {
                id: question_id
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


    async updateAuditFailCourseQuestion(params) {
        const {question_id, title, content, token} = params;
        const result = await this.app.mysql.update('course_question', {
            title,
            content,
            audit_status: 'ing',
            created_at: this.app.mysql.literals.now
        }, {
            where: {
                uid: token,
                id: question_id
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

    async getCourseQuestionNotify(params) {
        const {token, role} = params;
        const table = role === 'student' ? 'system_user' : 'teacher';
        const user = await this.app.mysql.get(table, {
            u_id: token
        });
        const notifyList = await this.app.mysql.select('course_question_notify', {
            where: {
                to_user_name: user['username']
            },
            columns: ['from_user_name', 'from_user_role', 'from_user_content', 'to_user_content', 'created_at'],
            orders: [['created_at', 'desc']],
        });
        return {
            status: 1,
            message: 'ok',
            notifyList
        }
    }

    async hasNewCourseQuestionNotify(params) {
        const {token, role} = params;
        const table = role === 'student' ? 'system_user' : 'teacher';
        const user = await this.app.mysql.get(table, {
            u_id: token
        });
        const notify = await this.app.mysql.get('course_question_notify', {
            to_user_name: user['username'],
            has_read: 0
        });
        return {
            status: 1,
            message: 'ok',
            hasNewNotify: notify ? true : false
        }
    }

    async setCourseQuestionNotify(params) {
        const {token, role} = params;
        const table = role === 'student' ? 'system_user' : 'teacher';
        const user = await this.app.mysql.get(table, {
            u_id: token
        });
        const result = await this.app.mysql.update('course_question_notify', {
            has_read: 1,
        }, {
            where: {
                to_user_name: user['username']
            }
        });
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

}

module.exports = CourseQuestionService;