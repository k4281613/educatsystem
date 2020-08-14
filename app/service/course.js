const Service = require('egg').Service;
const http = require('http');
const iconv = require('iconv-lite');
const querystring = require('querystring');
const asyncControl = require('async');
const cheerio = require("cheerio");

class CourseService extends Service {
    async addCourse(params) {
        const {name, code, classes, year, semester, token} = params;
        const schoolCourse = await this.app.mysql.get('school_course', {
            name
        });
        if (!schoolCourse) {
            return {
                status: 0,
                message: 'fail'
            }
        }
        const {desc_text} = schoolCourse;
        const result = await this.app.mysql.insert('course', {
            name,
            code,
            classes,
            year,
            semester,
            tid: token,
            created_at: this.app.mysql.literals.now,
            desc_text
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

    async getCourseList(params) {
        let {token, year, semester, offset, limit} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;
        const count = await this.app.mysql.count('course', {
            tid: token,
            year,
            semester
        });
        const courseList = await this.app.mysql.select('course', {
            where: {
                tid: token,
                year,
                semester
            },
            columns: ['id', 'name', 'code', 'classes'],
            limit: limit,
            offset: offset * limit,
        });
        return {
            status: 1,
            message: 'ok',
            courseList,
            count
        }
    }

    async deleteCourse(params) {
        const {token, id} = params;
        const result = await this.app.mysql.delete('course', {
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

    async getCourseDetail(params) {
        let {token, role, id} = params;
        if (role === 'student') {
            const course = await this.app.mysql.get('student_course', {
                uid: token,
                id
            });
            token = course ? course['tid'] : null;
            id = course ? course['t_course_id'] : null;
        }
        const course = await this.app.mysql.query('select name,code,classes,desc_url,desc_text from course where tid=? and id=? limit 0,1', [token, id]);
        return {
            status: 1,
            message: 'ok',
            courseDetail: course.length ? course[0] : null
        }
    }

    async getStudentList(params) {
        const {token, id} = params;
        const count = await this.app.mysql.count('student_course', {
            tid: token,
            t_course_id: id
        });
        const sql = 'select username,stu_number,major from system_user a,student_course b where a.u_id=b.uid and b.tid=? and b.t_course_id=?';
        const studentList = await this.app.mysql.query(sql, [token, id]);
        return {
            status: 1,
            message: 'ok',
            studentList,
            count
        }
    }

    async uploadCourseDesc(params) {
        const {token, file, field} = params;
        if (file.length == 0) return {
                status: 0,
                message: 'fail'
        }
        const id = field['id'];
        const desc_url = file[0]['filePath'];
        const result = await this.app.mysql.update('course', {
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


    async getStudentCourseList(params) {
        let {token, year, semester, number, password, offset, limit, method} = params;
        offset = offset ? Number(offset) - 1 : 0;
        limit = limit ? Number(limit) : 10;

        let count = await this.app.mysql.count('student_course', {
            uid: token,
            year,
            semester
        });
        if (number && password) {
            if (count > 0) {
                await this.app.mysql.delete('student_course', {
                    uid: token,
                    year,
                    semester
                });
            }
            const studentCourses = await getStudentCourses(number, password, year, semester);
            let {status, data} = studentCourses;
            if (status === 1 && data.length > 0) {
                let hash = {};
                data = data.reduce((pre, next) => {
                    hash[next.name] = hash[next.name] ? '' : hash[next.name] = true;
                    hash[next.code] = hash[next.code] ? '' : hash[next.code] = true;
                    hash[next.classes] = hash[next.classes] ? '' : hash[next.classes] = true;
                    if (hash[next.name] && hash[next.code] && hash[next.classes]) {
                        pre.push(next);
                    }
                    return pre;
                }, []);

                let sql = 'insert into student_course (name,code,classes,year,semester,uid,tid,t_course_id,created_at) values ';
                for (var i = 0; i < data.length; i++) {
                    const {name, code, classes} = data[i];
                    const course = await this.app.mysql.get('course', {
                        name,
                        code,
                        classes,
                        year,
                        semester
                    });
                    if (course) {
                        sql += `('${course.name}','${course.code}','${course.classes}','${year}','${semester}','${token}','${course.tid}','${course.id}','${course.created_at}'),`
                    }
                }
                if (sql[sql.length - 1] == ',') {
                    sql = sql.substring(0, sql.length - 1);
                    await this.app.mysql.query(sql);
                }
            } else if (status === 0) {
                return {
                    status: 0,
                    message: 'fail'
                }
            }
        }

        count = await this.app.mysql.count('student_course', {
            uid: token,
            year,
            semester
        });
        const sql = 'select a.id,a.name,a.code,a.classes,b.username as teacher,b.code as teacherNum from student_course a,teacher b where a.uid=? and a.year=? and a.semester=? and a.tid=b.u_id limit ?,?'
        const courseList = await this.app.mysql.query(sql, [token, year, semester, offset * limit, limit]);
        return {
            status: 1,
            message: 'ok',
            courseList,
            count
        }
    }


    async saveSchoolCourseMessage(params) {
        const {number, password, method} = params;
        if (method === 'update') {

        }
        let data = null,
            match = null,
            loginOption = {};
        // 获取登陆参数
        data = await request('class.sise.com.cn', 7001, '/sise/login.jsp', 'GET', {}, {});
        match = data['html'].match(/<input type="hidden" name="(.+)"  value="(.+)">/);
        loginOption[match[1]] = match[2];
        match = data['html'].match(/<input id="random"   type="hidden"  value="(.+)"  name="(.+)" \/>/);
        loginOption[match[2]] = match[1];
        loginOption['username'] = number;
        loginOption['password'] = password;
        // 模拟登陆
        data = await request('class.sise.com.cn', 7001, '/sise/login_check_login.jsp', 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        }, loginOption);
        // 登陆成功
        if (/<script>top.location.href=\'\/sise\/index.jsp\'<\/script>/.test(data['html'])) {
            const cookie = data['cookie'];
            const myHeaders = {
                'Cookie': cookie,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Host': 'class.sise.com.cn:7001',
                'Referer': 'http://class.sise.com.cn:7001/sise/module/selectclassview/selectclassallcourse_view.jsp',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            };
            data = await request('class.sise.com.cn', 7001, '/sise/module/selectclassview/selectclassallcourse_view.jsp', 'GET', {
                'Cookie': cookie
            }, {});
            let $ = cheerio.load(data['html']);
            let urlsArr = [];
            let courseUrls = $('.tablebody .font12 a');
            for (let i = 0; i < courseUrls.length; i++) {
                let courseUrl = courseUrls.eq(i).attr('href');
                urlsArr.push(courseUrl);
            }
            let count = 0;
            const fetchCourseDetail = function(url, callback) {
                const req = http.request({
                    hostname: 'class.sise.com.cn',
                    port: 7001,
                    path: url,
                    method: 'GET',
                    headers: myHeaders
                }, (res) => {
                    let length = 0,
                        arr = [];
                    res.on('data', (chunk) => {
                        arr.push(chunk);
                        length += chunk.length;
                    });
                    res.on('end', () => {
                        let data = Buffer.concat(arr, length);
                        let result = iconv.decode(data, 'gb2312');
                        $ = cheerio.load(result);
                        let courseName = $('.tableBodyleft div').eq(2).text().trim();
                        let courseDescText = $('.tableBodyleft div').eq(8).text().trim();
                        let delay = Math.floor((Math.random() * 10000000) % 5000);
                        count++;
                        console.log('正在抓取' + count + '：' + courseName + '          ' + '耗时：' + delay + '毫秒');
                        setTimeout(function() {
                            callback(null, {
                                courseName,
                                courseDescText,
                                url
                            });
                        }, delay);
                    });
                });
                req.end();

            }
            const _this = this;
            asyncControl.mapLimit(urlsArr, 2, function(url, callback) {
                fetchCourseDetail(url, callback);
            }, function(err, result) {
                let sql = 'insert into school_course (name,desc_text,url) values '
                result.forEach(function(item) {
                    sql += `('${item.courseName}','${item.courseDescText}','${item.url}'),`
                });
                sql = sql.substring(0, sql.length - 1);
                _this.app.mysql.query(sql);
                console.log('结束,共爬取' + result.length + '条记录');
            });
            return {
                status: 1,
                message: 'ok'
            }
        } else {
            return {
                status: 0,
                message: 'fail',
            };
        }

    }

}

module.exports = CourseService;


// 获取课程信息
async function getStudentCourses(num, pwd, schoolyear, semester) {
    let data = null,
        match = null,
        loginOption = {};
    // 获取登陆参数
    data = await request('class.sise.com.cn', 7001, '/sise/login.jsp', 'GET', {}, {});
    match = data['html'].match(/<input type="hidden" name="(.+)"  value="(.+)">/);
    loginOption[match[1]] = match[2];
    match = data['html'].match(/<input id="random"   type="hidden"  value="(.+)"  name="(.+)" \/>/);
    loginOption[match[2]] = match[1];
    loginOption['username'] = num;
    loginOption['password'] = pwd;
    // 模拟登陆
    data = await request('class.sise.com.cn', 7001, '/sise/login_check_login.jsp', 'POST', {
        'Content-Type': 'application/x-www-form-urlencoded'
    }, loginOption);
    // 登陆成功
    if (/<script>top.location.href=\'\/sise\/index.jsp\'<\/script>/.test(data['html'])) {
        // 获取课程信息
        data = await request('class.sise.com.cn', 7001, `/sise/module/student_schedular/student_schedular.jsp?schoolyear=${schoolyear}&semester=${semester}`, 'GET', {
            'cookie': data['cookie']
        }, {});
        // 课表表格信息
        match = data['html'].match(/<td width='10%' align='left' valign='top' class='font12'>(.+?)<\/td>/g);
        if (match) {
            let str = '',
                week = '',
                time = '',
                result = [],
                timeArr = ['09:00-10:20', '10:40-12:00', '12:30-13:50', '14:00-15:20', '15:30-16:50', '17:00-18:20', '19:00-20:20', '20:30-21:50'],
                weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
            match.forEach((item, index) => { // 循坏遍历构建合适的数据结构
                week = weekArr[index % 7];
                time = timeArr[Math.floor(index / 7)];
                str = item.match(/<td width='10%' align='left' valign='top' class='font12'>(.+)<\/td>/)[1];
                str.split(',').forEach((item) => { // 同一时间存在两门不同的课程
                    if (item !== '&nbsp;') {
                        let courseName = item.substring(0, item.lastIndexOf('('));
                        let split = item.substring(item.lastIndexOf('(') + 1).split(' ');
                        result.push({
                            name: courseName,
                            code: split[0],
                            classes: split[split.length - 1].substring(1, split[split.length - 1].lastIndexOf(']'))
                        })
                        ;
                    }
                });
            });
            return {
                status: 1,
                message: 'ok',
                data: result
            };
        }
    } else {
        return {
            status: 0,
            message: 'fail',
        };
    }
}


// http.request封装
function request(hostname, port, path, method, headers, postData) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: hostname,
            port: port,
            path: path,
            method: method,
            headers: headers
        };
        const req = http.request(options, (res) => {
            let length = 0,
                arr = [];
            res.on('data', (chunk) => {
                arr.push(chunk);
                length += chunk.length;
            });
            res.on('end', () => {
                let data = Buffer.concat(arr, length);
                let result = iconv.decode(data, 'gb2312');
                resolve({
                    cookie: res.headers['set-cookie'] ? res.headers['set-cookie'][0] : '',
                    html: result
                })
            });
        });
        req.on('error', (e) => {
            reject(e.message);
        });
        if (method === 'POST') {
            let body = querystring.stringify(postData);
            req.write(body);
        }
        req.end();
    });
}