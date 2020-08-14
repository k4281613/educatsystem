const Service = require('egg').Service;

class ExperService extends Service {

    //新建课时作业，姓名，本地路径，七牛云路径，周数，课程，课程ID,教师，开始时间，结束时间，分数
    async addexper(name,localname,localpath,webpath,semester,week,course,course_id,teacher,teach_id,fintime,startime){
        try{
            var result;
            const insertState = await this.app.mysql.insert('teach_outexper', {
                name: name,
                localname:localname,
                localpath:localpath,
                webpath:webpath,
                semester:semester,
                week:week,
                course:course,
                teacher:teacher,
                teach_id:teach_id,
                course_id:course_id,
                fintime:fintime,
                startime:startime
            });
            // 判断插入成功 ,1为成功，0为失败
            if(insertState.affectedRows===1) {
                result={
                    status:1,
                    text:'insert serve success',
                }
            }else{
                result={
                    status:0,
                    text:'insert serve fault',
                    err:insertState.sqlMessage
                }
            }
            return result;
        }catch (err){
            this.logger.error(err);
            return err;
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
            var ds=new Date(data[i].startime.valueOf());
            var df=new Date(data[i].fintime.valueOf());
            var startime=(ds.getFullYear()) + "-" + this.addzero((ds.getMonth() + 1)) + "-" + this.addzero(ds.getDate()) + " " + this.addzero(ds.getHours()) + ":" + this.addzero(ds.getMinutes()) + ":" + this.addzero(ds.getSeconds());
            var fintime=(df.getFullYear()) + "-" + this.addzero((df.getMonth() + 1)) + "-" + this.addzero(df.getDate()) + " " + this.addzero(df.getHours()) + ":" + this.addzero(df.getMinutes()) + ":" + this.addzero(df.getSeconds());
            data[i].startime=startime;
            data[i].fintime=fintime;
        }
    }
    async stu_filteTime(data){
        for(var i=0;i<data.length;i++){
            var dt=new Date(data[i].submit_time.valueOf());
            var submit_time=(dt.getFullYear()) + "-" + this.addzero((dt.getMonth() + 1)) + "-" + this.addzero(dt.getDate()) + " " + this.addzero(dt.getHours()) + ":" + this.addzero(dt.getMinutes()) + ":" + this.addzero(dt.getSeconds());
            data[i].submit_time=submit_time;
        }
    }
    //查看课时作业，课程，学期，周数
    async read(row,limit,page){
        var data,count,result;
        data = await this.app.mysql.select('teach_outexper',{
            where:row,
            limit:limit,
            offset:(page - 1)*limit,
            columns:['name','localname','id','webpath','week','course','fintime','startime'],
            orders:[['id','desc']]
        })
        for(var i=0;i<data.length;i++){
            var submitters_count=await this.app.mysql.query('select count(*) as num from stu_inexper where exper_id = ? and status not in(?,?)',[data[i].id,'未完成','已过期']);
            var submitterStatus;
            if(submitters_count[0].num!==0){
                submitterStatus={
                    text:'当前提交学生人数为:'+submitters_count[0].num+'人，不可修改，删除',
                    isOperate:0
                }
            }else {
                submitterStatus={
                    text:'暂无学生提交，可修改，删除',
                    isOperate:1
                }
            }
            data[i].submitterStatus=submitterStatus;
        }
        this.filteTime(data);
        count= await this.app.mysql.select('teach_outexper',{
            where:row
        });
        if(data.length!==0){
            result={
                status:1,
                text:row.course+'：查询成功',
                count:count.length,
                data:data,
            }
        }else{
            result={
                status:0,
                data:data,
                count:data.length,
                text:row.course+'：查询结果为空',
            }
        }
        return result;
    }
    async readexper(course,teacher,semester,week,limit,page){
        try{
            var result;
            if(week===undefined){
                var row={
                    course:course,
                    semester:semester,
                    teacher:teacher
                }
                result=await this.read(row,limit,page);
            }else{
                var row={
                    course:course,
                    semester:semester,
                    teacher:teacher,
                    week:week
                }
                result=await this.read(row,limit,page);
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

    //更新课时作业,作业id，作业名字，周数，开始时间，结束时间
    async updatexper(id,name,week,startime,fintime){
        try{
            const row={
                name:name,
                week:week,
                startime:startime,
                fintime:fintime

            }
            const data=await this.app.mysql.update('teach_outexper',row,{
                where:{
                    id:id
                }
            });
            const updateStatus=data.affectedRows;//更新结果
            var result;
            if(updateStatus===1){
                result={
                    status:1,
                    text:'更新成功',
                }
            }else{
                result={
                    status:0,
                    text:'更新失败',
                }
            }
            //console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'更新失败',
                err:err
            }
            this.logger.error(err);
            console.log(result);
            return result;
        }
    }

    //删除课时作业，作业id
    async delexper(id){
        try{
            const data=await this.app.mysql.delete('teach_outexper',{id:id});
            const deleteStatus=data.affectedRows;//删除结果
            var result;
            if(deleteStatus===1){
                result={
                    status:1,
                    text:'数据库删除成功',
                }
            }else{
                result={
                    status:0,
                    text:'数据库删除失败',
                }
            }
            console.log(result)
            //console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'数据库删除失败',
                err:err
            }
            this.logger.error(err);
            console.log(result);
            return result;
        }
    }

    //学生作业列表，用于评分
    async readStuExper(stuclass,exper_id,limit,page){
        try{
            var result,count;
            const data=await this.app.mysql.select('stu_outexper',{
                where:{
                    stuclass:stuclass,
                    exper_id:exper_id,
                },
                columns:['name','id','webpath','student','stu_id','submit_time','grade','status'],
                limit:limit,
                offset:(page - 1)*limit,
                orders:[['id','desc']]
            });
            this.stu_filteTime(data);
            count=await this.app.mysql.select('stu_outexper',{
                where:{
                    stuclass:stuclass,
                    exper_id:exper_id,
                },
                columns:['localname','name']
            });
            if(count.length==0){
                result={
                    status:0,
                    data:data,
                    text:'查询失败，数据为空'
                }
            }else{
                result={
                    status:1,
                    text:'查询成功',
                    data:data,
                    count:count.length,
                    alldata:count
                }
            }
            console.log(result);
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

    //作业评分
    async registerScore(id,grade){
        try{
            const row={
                grade:grade

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
                    text:'评分成功',
                }
            }else{
                result={
                    status:0,
                    text:'评分失败',
                }
            }
            console.log(result);
            return result;
        }catch(err) {
            this.logger.error(err);
            var result={
                status:0,
                text:'评分失败',
                err:err
            }
            console.log(result);
            return result;
        }
    }
}

module.exports = ExperService;