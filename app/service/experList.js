const Service = require('egg').Service;

class ExperService extends Service {

    //个位数补零
    addzero(time) {
        if (time < 10) {
            time = '0' + time;
        }
        return time;
    }

    //处理格林威治时间,教师表,开始，结束时间
    async teach_filteTime(data) {
        for (var i = 0; i < data.length; i++) {
            //console.log("修改前：",data[i].startime,data[i].startime.valueOf());
            var ds = new Date(data[i].startime.valueOf());
            var df = new Date(data[i].fintime.valueOf());
            var startime = (ds.getFullYear()) + "-" + this.addzero((ds.getMonth() + 1)) + "-" + this.addzero(ds.getDate()) + " " + this.addzero(ds.getHours()) + ":" + this.addzero(ds.getMinutes()) + ":" + this.addzero(ds.getSeconds());
            var fintime = (df.getFullYear()) + "-" + this.addzero((df.getMonth() + 1)) + "-" + this.addzero(df.getDate()) + " " + this.addzero(df.getHours()) + ":" + this.addzero(df.getMinutes()) + ":" + this.addzero(df.getSeconds());
            //console.log(startime,fintime);
            data[i].startime = startime;
            data[i].fintime = fintime;
        }
    }

    //学生表,开始，结束时间（外键）
    async stu_filteTime_exper(data) {
        for (var i = 0; i < data.length; i++) {
            //console.log("修改前：",data[i].startime,data[i].startime.valueOf());
            var ds = new Date(data[i].exper_startime.valueOf());
            var df = new Date(data[i].exper_fintime.valueOf());
            var startime = (ds.getFullYear()) + "-" + this.addzero((ds.getMonth() + 1)) + "-" + this.addzero(ds.getDate()) + " " + this.addzero(ds.getHours()) + ":" + this.addzero(ds.getMinutes()) + ":" + this.addzero(ds.getSeconds());
            var fintime = (df.getFullYear()) + "-" + this.addzero((df.getMonth() + 1)) + "-" + this.addzero(df.getDate()) + " " + this.addzero(df.getHours()) + ":" + this.addzero(df.getMinutes()) + ":" + this.addzero(df.getSeconds());
            //console.log(startime,fintime);
            data[i].exper_startime = startime;
            data[i].exper_fintime = fintime;
        }
    }

    //学生表提交时间
    async stu_filteTime(data) {
        for (var i = 0; i < data.length; i++) {
            //console.log("修改前：",data[i].startime,data[i].startime.valueOf());
            var time=data[i].submit_time;
            var dt = new Date(time.valueOf());
            var submit_time = (dt.getFullYear()) + "-" + this.addzero((dt.getMonth() + 1)) + "-" + this.addzero(dt.getDate()) + " " + this.addzero(dt.getHours()) + ":" + this.addzero(dt.getMinutes()) + ":" + this.addzero(dt.getSeconds());
            data[i].submit_time = submit_time;
        }
    }

    //分页处理
    async pading(data, count, limit, page) {
        var pagdata = [];
        if (count < limit) {
            pagdata = data;
        } else {
            for (var i = ((page - 1) * limit); i < (page * limit); i++) {
                pagdata.push(data[i]);
            }
        }
        return pagdata;
    }

    //搜索函数
    async searchFun(type, sql1, sql2, condition, field1, field2) {
        var outexper, data = [], inexper;
        //condition, student, stu_id,semester
        outexper = await this.app.mysql.query(sql1, [('%' + condition + '%'),field1, field2]);
        inexper = await this.app.mysql.query(sql2, [('%' + condition + '%'), field1, field2]);
        //console.log(outexper[0]);
        if (type == 'student') {
            this.stu_filteTime(outexper[0]);
            this.stu_filteTime_exper(outexper[0]);
            this.stu_filteTime_exper(inexper[0]);
            for (var i = 0; i < outexper[0].length; i++) {
                outexper[0][i].type = 'offline';
                data.push(outexper[0][i]);
            }
            for (var i = 0; i < inexper[0].length; i++) {
                if (type == 'student') {
                    delete inexper[0][i].student;//剔除对象中的学生属性
                    delete inexper[0][i].stu_id;//剔除对象中的学生属性
                } else {
                    delete inexper[0][i].teacher;
                    delete inexper[0][i].teach_id;
                }
                inexper[0][i].type = 'online';
                data.push(inexper[0][i]);
            }
        } else {
            this.teach_filteTime(outexper);
            for (var i = 0; i < outexper.length; i++) {
                outexper[i].type = 'offline';
                data.push(outexper[i]);
            }
            for (var i = 0; i < inexper.length; i++) {
                if (type == 'student') {
                    delete inexper[i].student;//剔除对象中的学生属性
                    delete inexper[i].stu_id;//剔除对象中的学生属性
                } else {
                    delete inexper[i].teacher;
                    delete inexper[i].teach_id;
                }
                inexper[i].type = 'online';
                data.push(inexper[i]);
            }
        }

        return data;
    }
    //判断作业是否过期
    async ispast(fintime,id,status,table){
        var result;
        console.log(new Date(fintime).getTime(),Date.now(),fintime<Date.now(),'第115行');
        if(fintime<Date.now()){
            console.log('已过期');
            if(status != '已过期'){
                const row={
                    id:id,
                    status:'已过期'
                }
                await this.app.mysql.update(table,row);
                result={
                    text:'已过期，改变状态',
                    status:1
                }
            }else{
                result={
                    text:'已过期，不改变状态',
                    status:0
                }
            }
        }else {
            console.log('未过期');
            result={
                text:'未过期',
                status:0
            }
        }
        return result;
    }
    //首页
    async index(sql1, sql2, sql3, sql4, obj, id, semester, type) {
        var indexData = [], incount, outcount, count, finished, unfinished;
        for (var i = 0; i < obj.length; i++) {
            var result;
            const finished1 = await this.app.mysql.query(sql1, [obj[i].course, id, semester, '已完成']);//在线作业
            const finished2 = await this.app.mysql.query(sql2, [obj[i].course, id, semester, '已完成']);//课时作业
            console.log(finished1);
            console.log(finished2);
            if (type == 'teacher') {
                incount = await this.app.mysql.query(sql3, [obj[i].course, id, semester]);
                outcount = await this.app.mysql.query(sql4, [obj[i].course, id, semester]);
                count = obj[i].num * (incount[0].num + outcount[0].num);
                finished = finished1[0][0].num + finished2[0][0].num;
                unfinished = count - finished;
            } else if (type == 'student') {
                incount = await this.app.mysql.query(sql3, [obj[i].course, obj[i].teach_id, semester]);
                outcount = await this.app.mysql.query(sql4, [obj[i].course, obj[i].teach_id, semester]);
                count = incount[0].num + outcount[0].num;
                finished = finished1[0][0].num + finished2[0][0].num;
                unfinished = count - finished;
            }
            result = {
                unfinished: unfinished,
                finished: finished,
                count: count,
                course: obj[i].course
            }
            indexData.push(result);
        }
        return indexData;
    }

    /*教师端*/
    async teachindex(obj, teach_id, semester) {
        try {
            var indexData, result;
            const sql1 = 'call GetStuInexperFinishedNum(?,?,?,?)';
            const sql2 = 'call GetStuOutexperFinishedNum(?,?,?,?)';
            const sql3 = 'select count(*) as num from teach_inexper where course = ? and teach_id = ? and semester = ?';
            const sql4 = 'select count(*) as num from teach_outexper where course = ? and teach_id = ? and semester = ?';
            indexData = await this.index(sql1, sql2, sql3, sql4, obj, teach_id, semester, 'teacher');
            for (var i = 0; i < indexData.length; i++) {
                const percentage = (parseFloat(indexData[i].finished) / parseFloat(indexData[i].count)).toFixed(2) * 100;
                indexData[i].percentage = percentage;
            }
            if (indexData.length == 0) {
                result = {
                    status: 0,
                    text: '暂无数据',
                    data: []
                }
            } else {
                result = {
                    status: 1,
                    text: '获取数据成功',
                    data: indexData
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            var result = {
                status: 0,
                text: '数据获取失败',
                err: err
            }
            return result;
        }
    }

    //获取发布的作业列表
    async GetsubmitterStatus(data,sql,type){
        for (var i=0;i<data.length;i++){
            var submitters_count=await this.app.mysql.query(sql,[data[i].id,'未完成','已过期']);
            var submitterStatus;
            if(submitters_count[0].num!==0){
                submitterStatus={
                    type:type,
                    text:'当前提交学生人数为:'+submitters_count[0].num+'人，不可修改，删除',
                    isOperate:0
                }
            }else {
                submitterStatus={
                    type:type,
                    text:'暂无学生提交，可修改，删除',
                    isOperate:1
                }
            }
            data[i].submitterStatus=submitterStatus;
        }
    }
    async addtype(data,type,dataTotal){
        for (var i = 0; i < data.length; i++) {
            data[i].type = type;
            dataTotal.push(data[i]);
        }
    }
    async TeachRead(row){
        var data;
        const teach_outexper = await this.app.mysql.select('teach_outexper', {
            where: row,
            columns: ['name', 'id', 'webpath', 'week', 'startime', 'fintime', 'course']
        });
        const sql1='select count(*) as num from stu_outexper where exper_id = ? and status not in(?,?)';
        await this.GetsubmitterStatus(teach_outexper,sql1,'offline');
        const teach_inexper = await this.app.mysql.select('teach_inexper', {
            where: row,
            columns: ['name', 'id', 'week', 'startime', 'fintime', 'totaltime', 'course']
        });
        const sql2='select count(*) as num from stu_inexper where exper_id = ? and status not in (?,?)';
        await this.GetsubmitterStatus(teach_inexper,sql2,'online');
        data={
            teach_outexper:teach_outexper,
            teach_inexper:teach_inexper
        }
        return data;
    }
    async Geteachlist(course, teacher, semester, week, limit, page) {
        try {
            //console.log(week);
            /*const sql = 'select * from teach_outexper and ';
            const test = await this.app.mysql.query(sql);
            console.log(test);*/
            var data = [], count, result, pagdata;
            if (week === undefined) {
                var row={
                    course: course,
                    semester: semester,
                    teacher: teacher
                }
                const teach_outexper = (await this.TeachRead(row)).teach_outexper;
                await this.addtype(teach_outexper,'offline',data);
                const teach_inexper = (await this.TeachRead(row)).teach_inexper;
                await this.addtype(teach_inexper,'online',data);
                this.teach_filteTime(data);
            }
            else {
                var row={
                    course: course,
                    semester: semester,
                    teacher: teacher,
                    week:week
                }
                const teach_outexper = (await this.TeachRead(row)).teach_outexper;
                await this.addtype(teach_outexper,'offline',data);
                const teach_inexper = (await this.TeachRead(row)).teach_inexper;
                await this.addtype(teach_inexper,'online',data);
                this.teach_filteTime(data);
            }
            count = data.length;
            //分页
            pagdata=await this.pading(data, count, limit, page);
            if (count == 0) {
                result = {
                    status: 0,
                    data: pagdata,
                    text: '获取列表失败，暂时无数据',
                }
            } else {
                result = {
                    status: 1,
                    text: '获取列表成功',
                    count: count,
                    data: pagdata,
                    //test:test
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            var result = {
                status: 0,
                text: '获取列表失败',
                err: err
            }
            console.log(result);
            return result;
        }
    }

    //获取问题详细
    async read_question(exper_id) {
        try {
            var result;
            const data = await this.app.mysql.select('teach_questions', {
                where: {
                    root_id: exper_id
                },
                columns: ['id', 'context', 'first_option', 'sec_option', 'third_option', 'fourth_option', 'type', 'answer', 'grade']
            })
            if (data.length == 0) {
                result = {
                    status: 0,
                    data: data,
                    text: '查询失败，暂无问题数据'
                }
            } else {
                result = {
                    status: 1,
                    text: '查询成功',
                    data: data
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            // console.log(err);
            var result = {
                status: 0,
                text: '查询失败',
                err: err
            }
            return result;
        }
    }

    //获取学生实验列表
    async Getstulist(course, teacher, stuclass, semester, week, limit, page) {
        try {
            var data = [], count, result, pagdata;
            const stu_outexper = await this.app.mysql.select('stu_outexper', {
                where: {
                    stuclass: stuclass,
                },
                columns: ['name', 'id', 'webpath', 'exper_id', 'grade', 'status', 'student', 'stu_id', 'submit_time', 'stuclass'],
                orders:[['id','desc']]
            });
            for(var i=0;i<stu_outexper.length;i++){
                const teach_outexper = await this.app.mysql.select('teach_outexper',{
                    where:{
                        id:stu_outexper[i].exper_id,
                        course: course,
                        semester: semester,
                        teacher: teacher,
                        week: week
                    },
                    orders:[['id','desc']]
                });
                stu_outexper[i].type = 'offline';
                stu_outexper[i].exper_name = teach_outexper[0].name;
                stu_outexper[i].exper_id = teach_outexper[0].id;
                stu_outexper[i].week = teach_outexper[0].week;
                stu_outexper[i].course = teach_outexper[0].course;
                data.push(stu_outexper[i]);
            }

            /*在线作业*/
            const stu_inexper = await this.app.mysql.select('stu_inexper', {
                where: {
                    stuclass: stuclass,
                },
                columns: ['id', 'exper_id', 'grade', 'status', 'student', 'stu_id', 'submit_time', 'stuclass', 'surplus_time'],
                orders:[['id','desc']],
            });

            for(var i=0;i<stu_inexper.length;i++){
                const teach_inexper = await this.app.mysql.select('teach_inexper',{
                    where:{
                        id:stu_inexper[i].exper_id,
                        course: course,
                        semester: semester,
                        teacher: teacher,
                        week: week
                    },
                    orders:[['id','desc']]
                });
                stu_inexper[i].type = 'online';
                stu_inexper[i].exper_name = teach_inexper[0].name;
                stu_inexper[i].exper_id = teach_inexper[0].id;
                stu_inexper[i].week = teach_inexper[0].week;
                stu_inexper[i].course = teach_inexper[0].course;
                data.push(stu_inexper[i]);
            }
            count = data.length;
            this.stu_filteTime(data);
            //分页
            pagdata = await this.pading(data,count,limit,page);
            if (count == 0) {
                result = {
                    status: 0,
                    data: pagdata,
                    text: '获取列表失败，暂时无数据',
                }
            } else {
                result = {
                    status: 1,
                    text: '获取列表成功',
                    count: count,
                    data: pagdata
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            var result = {
                status: 0,
                text: '获取列表失败',
                err: err
            }
            console.log(result);
            return result;
        }
    }

    //搜索实验指导书
    async TeachSearchexper(condition,semester, teach_id, limit, page) {
        try {
            var result, count, data, pagdata;
            const sql1 = 'select id,course,startime,fintime,name,semester,webpath,week from teach_outexper where concat(`course`,`name`,`week`) like ? and teach_id = ? and semester = ?';
            const sql2 = 'select * from teach_inexper where concat(`course`,`name`,`week`) like ? and teach_id = ? and semester = ?';
            data = await this.searchFun('teacher', sql1, sql2, condition, teach_id,semester);
            const sql3='select count(*) as num from stu_outexper where exper_id = ? and status !=  ?';
            const sql4='select count(*) as num from stu_inexper where exper_id = ? and status !=  ?';
            var offlinData=[],onlineData=[];
            for(var i=0;i<data.length;i++){
                if(data[i].type=='offline'){
                    offlinData.push(data[i]);
                }else{
                    onlineData.push(data[i])
                }
            }
            await this.GetsubmitterStatus(offlinData,sql3,'offline');
            await this.GetsubmitterStatus(onlineData,sql4,'offline');
            for(var j=0;j<data.length;j++){
                delete data[j].submitterStatus.type;
            }
            count = data.length;
            pagdata = await this.pading(data, count, limit, page);
            if (count == 0) {
                result = {
                    status: 0,
                    data: pagdata,
                    text: '搜索失败,暂无数据',
                }
            } else {
                result = {
                    status: 1,
                    text: '搜索成功',
                    count: count,
                    data: pagdata
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            //console.log(err)
            var result = {
                status: 0,
                text: '搜索失败',
                err: err
            }
            return result
        }
    }

    //搜索学生实验，教师端
    async SearchStuexper(type,condition,semester,course,stuclass,week,exper_id, teacher, teach_id, limit, page) {
        try {
            var result, count, data, pagdata;
            var sql1 = 'select grade,id,status,submit_time,webpath,student,stu_id from stu_outexper where concat(`student`,`stu_id`) like ? and stuclass = ? and exper_id = ? ';
            var sql2 = 'select grade,id,status,submit_time,student,stu_id from stu_inexper where concat(`student`,`stu_id`) like ? and stuclass = ?  and exper_id = ?';
            if(type=='offline'){
                data = await this.app.mysql.query(sql1,[('%' + condition + '%'),stuclass,exper_id]);
            }else if(type=='online'){
                data = await this.app.mysql.query(sql2,[('%' + condition + '%'),stuclass,exper_id]);
                for(var i=0;i<data.length;i++){
                    const questions=await this.app.mysql.select('teach_questions',{
                        where:{
                            root_id:exper_id
                        }
                    })
                    for(var j=0;j<questions.length;j++){
                        const stuanswer=await this.app.mysql.select('stu_questions',{
                            where:{
                                quest_id:questions[j].id,
                                root_id:data[i].id
                            },
                            columns:['id','grade','answer']
                        })
                        questions[j].stuanswer=stuanswer[0];
                    }
                    data[i].questions=questions;
                }
            }else {
                result = {
                    status: 0,
                    data: [],
                    text: '输入类型错误'
                }
                return result;
            }
            count = data.length;
            pagdata = await this.pading(data, count, limit, page);
            for(var i=0;i<pagdata.length;i++){
                pagdata[i].type=type;
            }
            if (count == 0) {
                result = {
                    status: 0,
                    data: pagdata,
                    text: '搜索失败,暂无数据',
                }
            } else {
                result = {
                    status: 1,
                    text: '搜索成功',
                    count: count,
                    data: pagdata
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            //console.log(err)
            var result = {
                status: 0,
                text: '搜索失败',
                err: err
            }
            return result
        }
    }

    /*学生端*/
    async stuindex(obj, stu_id, semester) {
        try {
            var indexData, result;
            const sql1 = 'call StuGetInexperFinishedNum(?,?,?,?)';
            const sql2 = 'call StuGetOutexperFinishedNum(?,?,?,?)';
            const sql3 = 'select count(*) as num from teach_inexper where course = ? and teach_id = ? and semester = ?';
            const sql4 = 'select count(*) as num from teach_outexper where course = ? and teach_id = ? and semester = ?';
            indexData = await this.index(sql1, sql2, sql3, sql4, obj, stu_id, semester, 'student');
            if (indexData.length == 0) {
                result = {
                    status: 0,
                    text: '暂无数据',
                    data: []
                }
            } else {
                result = {
                    status: 1,
                    text: '获取数据成功',
                    data: indexData
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            var result = {
                status: 0,
                text: '数据获取失败',
                err: err
            }
            return result;
        }
    }

    //学生获取当前全部作业
    async dataExist(sql1,sql2,data,stu_id,student,stuclass,Totaldata,type){
        for (var i=0;i<data.length;i++){
            const dataExist=await this.app.mysql.query(sql1,[data[i].id, stu_id])
            var result;
            if(dataExist[0].status==0){
                if(type=='online'){
                    await this.app.mysql.query(sql2,[student,stu_id,stuclass,data[i].id,'未完成',data[i].totaltime,'待提交']);
                }else if(type=='offline'){
                    await this.app.mysql.query(sql2,['待上传', '待上传', '待上传', '待上传', student, stu_id, stuclass, data[i].id, '待提交']);
                }else {
                    type='实验类型错误';
                }
                result={
                    type:type,
                    existStatus:dataExist[0].status,
                    updatStatus:1,
                    text:'第'+(i+1)+'记录不存在，更新表数据'
                }
            }else{
                result={
                    type:type,
                    existStatus:dataExist[0].status,
                    updatStatus:0,
                    text:'第'+(i+1)+'记录存在，不执行操作'
                }
            }
            Totaldata.push(result);
        }
    }
    async updatStuexper(row,student,stu_id,stuclass){//更新学生数据
        var data=[];
        /*课时作业*/
        const teach_outexper = await this.app.mysql.select('teach_outexper', {
            where: row
        })
        const sql1='select count(*) as status from stu_outexper where exper_id = ? and stu_id = ?';
        const sql2='insert IGNORE into stu_outexper(name,localname,localpath,webpath,student,stu_id,stuclass,exper_id,submit_time) VALUES(?,?,?,?,?,?,?,?,?)';
        await this.dataExist(sql1,sql2,teach_outexper,stu_id,student,stuclass,data,'offline');
        /*在线作业*/
        const teach_inexper=await this.app.mysql.select('teach_inexper',{
            where:row
        })
        const sql3='select count(*) as status from stu_inexper where exper_id = ? and stu_id = ?';
        const sql4='insert IGNORE into stu_inexper(student,stu_id,stuclass,exper_id,status,surplus_time,submit_time) VALUES(?,?,?,?,?,?,?)';
        await this.dataExist(sql3,sql4,teach_inexper,stu_id,student,stuclass,data,'online');
        console.log(data);
        return data;
    }
    async StuRead(row,data){
        const stu_outexper = await this.app.mysql.select('stu_outexper', {
            where: {
                stu_id:row.stu_id
            },
            columns: ['name', 'id', 'webpath', 'exper_id', 'student', 'stu_id', 'stuclass', 'submit_time', 'grade', 'status']
        })
        //console.log(stu_outexper);
        for (var i = 0; i < stu_outexper.length; i++) {
            var teach_outexper;
            if (row.week===undefined){
                teach_outexper= await this.app.mysql.select('teach_outexper', {
                    where:{
                        id:stu_outexper[i].exper_id,
                        semester:row.semester,
                        course: row.course,
                    },
                    columns: ['webpath', 'week', 'course', 'name', 'teacher', 'fintime', 'startime', 'semester']
                })
            }else {
                teach_outexper= await this.app.mysql.select('teach_outexper', {
                    where:{
                        id:stu_outexper[i].exper_id,
                        semester:row.semester,
                        course: row.course,
                        week:row.week
                    },
                    columns: ['webpath', 'week', 'course', 'name', 'teacher', 'fintime', 'startime', 'semester']
                })
            }
            //console.log(teach_outexper);
            if(teach_outexper.length!==0){
                stu_outexper[i].week = teach_outexper[0].week;
                stu_outexper[i].course = teach_outexper[0].course;
                stu_outexper[i].exper_name = teach_outexper[0].name;
                stu_outexper[i].exper_startime = teach_outexper[0].startime;
                stu_outexper[i].exper_fintime = teach_outexper[0].fintime;
                stu_outexper[i].teacher = teach_outexper[0].teacher;
                stu_outexper[i].semester = teach_outexper[0].semester;
                stu_outexper[i].type = 'offline';
                const ispastresult=await this.ispast(stu_outexper[i].exper_fintime,stu_outexper[i].id,stu_outexper[i].status,'stu_outexper');
                if(ispastresult.status==1){
                    stu_outexper[i].status='已过期';
                }
                data.push(stu_outexper[i]);
            }else {
                break;
            }
        }
        /*在线作业*/
        const stu_inexper = await this.app.mysql.select('stu_inexper', {
            where: {
                stu_id:row.stu_id
            }
        })
        console.log(stu_inexper.length);
        for (var i = 0; i < stu_inexper.length; i++) {
            var teach_inexper;
            if(row.week===undefined){
                teach_inexper= await this.app.mysql.select('teach_inexper', {
                    where:{
                        id:stu_inexper[i].exper_id,
                        semester:row.semester,
                        course: row.course,
                    },
                    columns: [ 'week', 'course', 'name', 'teacher', 'fintime', 'startime', 'semester','totaltime']
                })
            }else {
                teach_inexper= await this.app.mysql.select('teach_inexper', {
                    where:{
                        id:stu_inexper[i].exper_id,
                        semester:row.semester,
                        course: row.course,
                        week: row.week,
                    },
                    columns: [ 'week', 'course', 'name', 'teacher', 'fintime', 'startime', 'semester','totaltime']
                })
            }
            if(teach_inexper.length!==0){
                stu_inexper[i].week = teach_inexper[0].week;
                stu_inexper[i].course = teach_inexper[0].course;
                stu_inexper[i].exper_name = teach_inexper[0].name;
                stu_inexper[i].exper_startime = teach_inexper[0].startime;
                stu_inexper[i].exper_fintime = teach_inexper[0].fintime;
                stu_inexper[i].teacher = teach_inexper[0].teacher;
                stu_inexper[i].semester = teach_inexper[0].semester;
                stu_inexper[i].type = 'offline';
                const ispastresult=await this.ispast(stu_inexper[i].exper_fintime,stu_inexper[i].id,stu_inexper[i].status,'stu_inexper');
                if(ispastresult.status==1){
                    stu_inexper[i].status='已过期';
                }
                data.push(stu_inexper[i]);
            }else {
                break;
            }
        }
        //this.stu_filteTime(stu_inexper);
        this.stu_filteTime_exper(data);
    }
    //全部作业main函数
    async Stugetexperlist(obj, student, stu_id, semester, week, limit, page) {
        try {
            console.log(obj.length);
            var data = [], count, result, pagdata;
            for (var j = 0; j < obj.length; j++) {
                var row1;
                if(week===undefined){
                    row1={
                        course: obj[j].course,
                        semester: semester,
                        teacher: obj[j].teacher,
                    }
                }else {
                    row1={
                        course: obj[j].course,
                        semester: semester,
                        teacher: obj[j].teacher,
                        week:week
                    }
                }
                await this.updatStuexper(row1,student,stu_id,obj[j].stuclass);
                //查看更新后的数据
                var row2={
                    course: obj[j].course,
                    semester: semester,
                    stu_id: stu_id,
                    week:week
                }
                await this.StuRead(row2,data);
            }
            count = data.length;
            //分页
            pagdata=await this.pading(data, count, limit, page);
            if (count == 0) {
                result = {
                    status: 0,
                    data: pagdata,
                    text: '查询失败，暂无数据'
                }
            } else {
                result = {
                    status: 1,
                    text: '查询成功',
                    count: count,
                    data: pagdata
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            var result = {
                text: '查询失败',
                err: err
            }
            return result
        }
    }

    //搜索学生实验,学生端
    async StuSearchexper(condition,semester, stu_id, limit, page) {
        try {
            var result, count, data, pagdata;
            var sql1 = 'call stuSearchoutexper(?,?,?)';
            var sql2 = 'call stuSearchinexper(?,?,?)';//缺个搜实验名
            data = await this.searchFun('student', sql1, sql2, condition, stu_id,semester);
            count = data.length;
            //分页
            pagdata = await this.pading(data, count, limit, page);
            if (count == 0) {
                result = {
                    status: 0,
                    data: pagdata,
                    text: '搜索失败,暂无数据',
                }
            } else {
                result = {
                    status: 1,
                    text: '搜索成功',
                    count: count,
                    data: pagdata
                }
            }
            return result;
        } catch (err) {
            this.logger.error(err);
            //console.log(err)
            var result = {
                status: 0,
                text: '搜索失败',
                err: err
            }
            return result
        }
    }

}
module.exports = ExperService;