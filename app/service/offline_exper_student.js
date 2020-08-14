const Service = require('egg').Service;

class ExperService extends Service {

    //提交课时作业，作业id,作业名，本地名字，本地路径，网络路径，提交时间
    async subexper(id,name,localname,localpath,webpath,submit_time){
        try{
            const row={
                name:name,
                localname:localname,
                localpath:localpath,
                webpath:webpath,
                submit_time:submit_time,
                status:'已完成'
            }
            const data=await this.app.mysql.update('stu_outexper',row,{
                where:{
                    id:id
                }
            });
            const updateStatus=data.affectedRows;//更新结果
            var result;
            if(updateStatus===1){
                result={
                    status:1,
                    text:'提交成功',
                    success:data.message
                }
            }else{
                result={
                    status:0,
                    text:'当前作业不存在，提交失败，请重新上传',
                    err:data
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
    //查看课时作业，对象（课程，班级，教师），学生，学期，周数，查询记录数，页码
    async updatStuexper(row,student,stu_id,stuclass){//更新学生数据
        var data=[];
        const teacher_data=await this.app.mysql.select('teach_outexper',{
            where:row
        })
        for (var i=0;i<teacher_data.length;i++){
            const dataExist=await this.app.mysql.query('select count(*) as status from stu_outexper where exper_id = ? and stu_id = ?',[teacher_data[i].id, stu_id]
            )
            var result;
            if(dataExist[0].status==0){
                await this.app.mysql.query(
                    'insert IGNORE into stu_outexper(name,localname,localpath,webpath,student,stu_id,stuclass,exper_id,submit_time) VALUES(?,?,?,?,?,?,?,?,?)',
                    ['待上传','待上传','待上传','待上传',student,stu_id,stuclass,teacher_data[i].id,'待提交']
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
        //console.log(row);
        const stu_outexper = await this.app.mysql.select('stu_outexper',{
            where:{
                stu_id:row.stu_id,
                student:row.student,
            },
            columns:['name','id','webpath','exper_id','student','stu_id','stuclass','submit_time','grade','status'],
            orders:[['id','desc']]
        })
        for(var i=0;i<stu_outexper.length;i++){
            var teach_outexper;
            if(row.week===undefined) {
                teach_outexper = await this.app.mysql.select('teach_outexper', {
                    where: {
                        id: stu_outexper[i].exper_id,
                        course: row.course,
                        semester: row.semester,
                    },
                    columns: ['webpath', 'week', 'course', 'name', 'teacher', 'fintime', 'startime', 'semester'],
                });
            }else {
                teach_outexper = await this.app.mysql.select('teach_outexper', {
                    where: {
                        id: stu_outexper[i].exper_id,
                        course: row.course,
                        semester: row.semester,
                        week: row.week
                    },
                    columns: ['webpath', 'week', 'course', 'name', 'teacher', 'fintime', 'startime', 'semester'],
                });
            }
            if(teach_outexper.length!==0){
                stu_outexper[i].exper_webpath=teach_outexper[0].webpath;
                stu_outexper[i].exper_name=teach_outexper[0].name;
                stu_outexper[i].exper_fintime=teach_outexper[0].fintime;
                stu_outexper[i].exper_startime=teach_outexper[0].startime;
                stu_outexper[i].week=teach_outexper[0].week;
                stu_outexper[i].course=teach_outexper[0].course;
                stu_outexper[i].semester=teach_outexper[0].semester;
                stu_outexper[i].teacher=teach_outexper[0].teacher;
                const ispastresult=await this.ispast(stu_outexper[i].exper_fintime,stu_outexper[i].id,stu_outexper[i].status,'stu_outexper');
                if(ispastresult.status==1){
                    stu_outexper[i].status='已过期';
                }
                data.push(stu_outexper[i]);
            }
        }
        this.filteTime(data);
        //计算实验总数
        const count=data.length;
        console.log(count);
        pagdata=await this.pading(data, count, limit, page);
        result={
            data:pagdata,
            count:count
        }
        return result;
    };
    async readexper(obj,student,stu_id,semester,week,limit,page){
        try{
            //console.log("周数",week)
            var data,result;
            var course=[];
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
                //查询更新后的学生表
                course.push(obj[i].course);
            }
            const row2={
                course:course,
                semester:semester,
                student:student,
                stu_id:stu_id,
                week:week
            }
            const readresult=await this.read(row2,limit,page);
            data=readresult.data;
            count=readresult.count;
            if(count){
                result={
                    status:1,
                    text:'查询成功',
                    count:count,
                    data:data,
                }
            }else{
                result={
                    status:0,
                    data:data,
                    text:'查询结果为空',
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

}

module.exports = ExperService;