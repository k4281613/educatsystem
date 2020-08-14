const Service = require('egg').Service;

class ExperService extends Service {

    //提交在线作业，作业id,剩余时间，提交时间
    async subexper(id,status,surplus_time,submit_time,questions){
        try{
            var result;
            const exper_id=await this.app.mysql.select('stu_inexper',{
                where:{
                    id:id
                },
                columns:['exper_id']
            });
            const istime=await this.app.mysql.select('teach_inexper',{
                where:{
                    id:exper_id[0].exper_id
                },
                columns:['fintime']
            });
            //console.log(istime[0].startime.valueOf(),);
            if(istime[0].fintime.valueOf()>=Date.parse(submit_time)){
                if(surplus_time>=0){
                    const row={
                        submit_time:submit_time,
                        surplus_time:surplus_time,
                        status:status
                    }
                    const updatedata=await this.app.mysql.update('stu_inexper',row,{
                        where:{
                            id:id
                        }
                    });
                    const updateStatus=updatedata.affectedRows;//更新结果
                    var insertdata,statusArr=[];
                    for(var i=0;i<questions.length;i++){
                        var recordExist=await  this.app.mysql.query('SELECT count(*) as status FROM stu_questions where root_id = ? and quest_id = ?',
                            [id,questions[i].quest_id]);
                        console.log('记录是否存在:',);
                        if(recordExist[0].status==0){
                            insertdata=await this.app.mysql.insert('stu_questions',{
                                    root_id: id,
                                    quest_id:questions[i].quest_id,
                                    answer:questions[i].answer
                                }
                            )
                            const insertStatus=insertdata.affectedRows;
                            var text;
                            if(insertStatus==1){text='成功';}else{text='失败';}
                            const result={
                                status:insertStatus,
                                text:'问题'+(i+1)+'提交'+text
                            }
                            statusArr.push(result);
                        }else{
                            const row={
                                answer:questions[i].answer
                            };
                            insertdata=await this.app.mysql.update('stu_questions',row,{
                                    where:{
                                        root_id: id,
                                        quest_id:questions[i].quest_id,
                                    }
                                }
                            )
                            const insertStatus=insertdata.affectedRows;
                            var text;
                            if(insertStatus==1){text='成功';}else{text='失败';}
                            const result={
                                status:insertStatus,
                                text:'问题'+(i+1)+'重新提交'+text
                            }
                            statusArr.push(result);
                        }
                    }
                    if(updateStatus===1){
                        result={
                            statusArr:statusArr
                        }
                    }else{
                        result={
                            status:0,
                            text:'提交失败，请重新提交',
                            err:updatedata
                        }
                    }
                }else{
                    result={
                        status:0,
                        text:'提交失败，已无剩余时间',
                    }
                }
            }else {
                result={
                    status:0,
                    text:'在线作业已过期',
                }
            }
            console.log(result);
            return result;
        }catch (err){
            this.logger.error(err);
            var result={
                status:0,
                text:'提交失败，请重新上传',
                err:err
            }
            return result;
        }
    }

    //个位数补零
    addzero(time){
        if(time < 10 ){
            time='0'+time;
        }
        return time;
    }

    //处理格林威治时间
    async filteTime(data){
        for(var i=0;i<data.length;i++){
            //console.log("修改前：",data[i].startime,data[i].startime.valueOf());
            var ds=new Date(data[i].exper_startime.valueOf());
            var df=new Date(data[i].exper_fintime.valueOf());
            var startime=(ds.getFullYear()) + "-" + this.addzero((ds.getMonth() + 1)) + "-" + this.addzero(ds.getDate()) + " " + this.addzero(ds.getHours()) + ":" + this.addzero(ds.getMinutes()) + ":" + this.addzero(ds.getSeconds());
            var fintime=(df.getFullYear()) + "-" + this.addzero((df.getMonth() + 1)) + "-" + this.addzero(df.getDate()) + " " + this.addzero(df.getHours()) + ":" + this.addzero(df.getMinutes()) + ":" + this.addzero(df.getSeconds());
            //console.log(startime,fintime);
            data[i].exper_startime=startime;
            data[i].exper_fintime=fintime;
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

    //查看在线作业
    async updatStuexper(row,student,stu_id,stuclass){//更新学生数据
        var data=[];
        const teacher_data=await this.app.mysql.select('teach_inexper',{
            where:row
        })
        for (var i=0;i<teacher_data.length;i++){
            const dataExist=await this.app.mysql.query('select count(*) as status from stu_inexper where exper_id = ? and stu_id = ?',[teacher_data[i].id, stu_id]
            )
            var result;
            if(dataExist[0].status==0){
                await this.app.mysql.query(
                    'insert IGNORE into stu_inexper(student,stu_id,stuclass,exper_id,status,surplus_time,submit_time) VALUES(?,?,?,?,?,?,?)',
                    [student,stu_id,stuclass,teacher_data[i].id,'未完成',teacher_data[i].totaltime,'待提交']
                );
                result={
                    existStatus:dataExist[0].status,
                    updatStatus:1,
                    text:'第'+(i+1)+'记录不存在，更新表数据'
                }
            }else{
                result={
                    existStatus:dataExist[0].status,
                    updatStatus:0,
                    text:'第'+(i+1)+'记录存在，不执行操作'
                }
            }
            data.push(result);
        }
        console.log(data);
        return data;
    }
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
    async read(row,limit,page){
        var result,data=[],pagdata;
        const stu_inexper=await this.app.mysql.select('stu_inexper',{
            where:{
                stu_id:row.stu_id
            },
            orders:[['id','desc']]
        })
        for(var i=0;i<stu_inexper.length;i++){
            var teach_inexper;
            if(row.week===undefined){
                teach_inexper=await this.app.mysql.select('teach_inexper',{
                    where:{
                        id:stu_inexper[i].exper_id,
                        semester:row.semester,
                        course:row.course,
                    }
                })
            }else {
                teach_inexper=await this.app.mysql.select('teach_inexper',{
                    where:{
                        id:stu_inexper[i].exper_id,
                        semester:row.semester,
                        course:row.course,
                        week:row.week
                    }
                })
            }
            if(teach_inexper.length!==0){
                stu_inexper[i].course=teach_inexper[0].course;
                stu_inexper[i].week=teach_inexper[0].week;
                stu_inexper[i].semester=teach_inexper[0].semester;
                stu_inexper[i].exper_fintime=teach_inexper[0].fintime;
                stu_inexper[i].exper_startime=teach_inexper[0].semester;
                stu_inexper[i].totaltime=teach_inexper[0].totaltime;
                stu_inexper[i].exper_name=teach_inexper[0].name;
                stu_inexper[i].teacher=teach_inexper[0].teacher;
                //console.log(new Date(stu_inexper[i].exper_fintime).getTime(),Date.now(),stu_inexper[i].exper_fintime<Date.now(),'第155行');
                const ispastresult=await this.ispast(stu_inexper[i].exper_fintime,stu_inexper[i].id,stu_inexper[i].status,'stu_inexper');
                if(ispastresult.status==1){
                    stu_inexper[i].status='已过期';
                }
                data.push(stu_inexper[i])
            }
        }
        this.filteTime(data);
        const count=data.length;
        pagdata=await this.pading(data, count, limit, page);
        result={
            data:pagdata,
            count:count
        }
        return result;
    };
    async ondoingStatus(row){
        var ondoingStatus;
        const ondoing = await this.app.mysql.select('stu_inexper',{
            where:row
        })
        if(ondoing.length<1){
            ondoingStatus={
                status:1,
                text:'无作业进行中',
                ondoingcount:ondoing.length
            }
        }else {
            ondoingStatus={
                status:0,
                text:'一份或者以上的作业进行中',
                ondoingcount:ondoing.length
            }
        }
        return ondoingStatus;
    }
    async readexper(obj,student,stu_id,semester,week,limit,page){   //对象（课程，班级，教师）
        try{
            var data,result;
            var CourseData=[],course=[];
            var count;

            for(var i =0;i<obj.length;i++) {
                //更新学生数据
                var row1;
                if(week===undefined){
                    row1 = {
                        course: obj[i].course,
                        semester: semester,
                        teacher: obj[i].teacher,
                    }
                }else {
                    row1 = {
                        course: obj[i].course,
                        semester: semester,
                        teacher: obj[i].teacher,
                        week: week
                    }
                }
                await this.updatStuexper(row1, student, stu_id, obj[i].stuclass);
                course.push(obj[i].course);
            }
            //查询更新后的学生表
            const row2={
                course:course,
                semester:semester,
                stu_id:stu_id,
                week:week
            }//查询数据条件
            const readresult=await this.read(row2,limit,page);
            data=readresult.data;
            for(var j=0;j<data.length;j++){
                CourseData.push(data[j]);
            }
            count=readresult.count;

            const ondoingRow={
                stu_id:stu_id,
                status:'进行中'
            }
            const ondoingStatus=await this.ondoingStatus(ondoingRow);
            if(count==0){
                result={
                    status:0,
                    data:CourseData,
                    text:'查询结果为空'
                }
            }else{
                result={
                    status:1,
                    text:'查询成功',
                    count:count,
                    data:CourseData,
                    ondoingStatus:ondoingStatus
                }
            }
            return result;
        }catch (err){
            var result={
                status:0,
                text:'查询失败',
                err:err
            }
            this.logger.error(err);
            console.log(result);
            return result;
        }
    }

//查看作业详细问题，教师发布的在线作业id
    async readquestion(exper_id){
        var teacher_data,result;
        try{
            teacher_data = await this.app.mysql.select('teach_questions',{
                where:{
                    root_id:exper_id
                },
                columns:['context','first_option','sec_option','third_option','fourth_option','type','grade','id'],
                orders:[['id','desc']]
            })
            //console.log(teacher_data);
            result = {
                status:1,
                text:'查找成功',
                data:teacher_data
            }
            return result;
        }catch (err){
            result = {
                status:0,
                text:'查找失败',
                err:err
            }
            this.logger.error(err);
            //console.log(result);
            return result;
        }
    }

//查看评分后的作业详细问题,作业id
    async read_scored_exper(id,exper_id){
        var teach_data,stu_data,data=[],result;
        try{
            teach_data = await this.app.mysql.select('teach_questions',{
                where:{
                    root_id:exper_id
                }
            })
            data=teach_data;
            stu_data = await  this.app.mysql.select('stu_questions',{
                where:{
                    root_id:id
                }
            })
            for(var i=0;i<data.length;i++){
                data[i].stuanswer=' ';
                data[i].stugrade=' ';
                for(var j=0;j<stu_data.length;j++){
                    if(stu_data[j].quest_id==data[i].id){
                        data[i].stuanswer=stu_data[j].answer;
                        data[i].stugrade=stu_data[j].grade;
                    }
                }
            }
            // console.log(teach_data);
            result = {
                status:1,
                text:'查找成功',
                data:data
            }
            return result;
        }catch (err){
            result = {
                status:0,
                text:'查找失败',
                err:err
            }
            this.logger.error(err);
            //console.log(result);
            return result;
        }
    }
}

module.exports = ExperService;