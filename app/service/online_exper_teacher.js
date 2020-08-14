const Service = require('egg').Service;

class ExperService extends Service {

    //新建作业--大题目,名字,课程,教师,学期,课时,总时间,剩余时间,开始时间,结束时间,总分数
    async addexper(name,course,teacher,teach_id,semester,week,totaltime,fintime,startime){
        try{
            const result = await this.app.mysql.insert('teach_inexper', {
                name: name,
                course:course,
                teacher:teacher,
                teach_id:teach_id,
                semester:semester,
                week:week,
                totaltime:totaltime,
                fintime:fintime,
                startime:startime,
            });
            // 判断插入成功 ,1为成功，0为失败
            const insertState = result.affectedRows;
            var data;
            if(insertState===1) {
                const GetId=await this.app.mysql.query('select max(id) as id from teach_inexper;');
                data={
                    status:1,
                    id:GetId[0].id,
                    text:'insert serve success'
                }
            }else{
                data={
                    status:0,
                    text:'insert serve fault',
                    err:result.sqlMessage
                }
            }
            console.log(data);
            return data;
        }catch (err){
            this.logger.error(err);
            data={
                status:0,
                text:'insert serve fault',
                err:err
            }
            return data;
        }
    }
    //新建作业--小题目
    async addquestion(root_id,questions){
        try{
            var data=[],result;
            for(var i=0;i<questions.length;i++){
                const insertStatus = await this.app.mysql.insert('teach_questions', {
                    root_id:root_id,
                    context:questions[i].context,
                    first_option:questions[i].obj.first_option,
                    sec_option:questions[i].obj.sec_option,
                    third_option:questions[i].obj.third_option,
                    fourth_option:questions[i].obj.fourth_option,
                    type:questions[i].qtype,
                    answer:questions[i].answer,
                    grade:questions[i].grade
                });
                var insertQuestions,GetId,record;
                if(questions[i].status==='new'){
                    insertQuestions=await this.app.mysql.insert('exper_questions', {
                        context:questions[i].context,
                        first_option:questions[i].obj.first_option,
                        sec_option:questions[i].obj.sec_option,
                        third_option:questions[i].obj.third_option,
                        fourth_option:questions[i].obj.fourth_option,
                        course:questions[i].course,
                        Category:questions[i].Category,
                        type:questions[i].qtype,
                        answer:questions[i].answer,
                        grade:questions[i].grade
                    });
                    GetId=await this.app.mysql.query('select max(id) as id from exper_questions;');
                    record=await this.app.mysql.insert('modifyrecord',{
                        teach_id:0,
                        teacher:'-----',
                        operation:'新增题目',
                        course:questions[i].course,
                        Category:questions[i].Category,
                        quest_id:GetId[0].id,
                    });
                }else{
                    record={};insertQuestions={};
                    record.affectedRows=0+'(题库中的问题，不做重复插入)';
                    insertQuestions.affectedRows=0+'(题库中的问题，不做重复插入)';
                }
                if(insertStatus.affectedRows===1) {
                    result={
                        status:1,
                        text:'第'+(i+1)+'个问题新增成功,题库插入状态：'+insertQuestions.affectedRows+',记录插入状态：'+record.affectedRows
                    }
                }else{
                    result={
                        status:0,
                        text:'第'+(i+1)+'个问题新增失败,题库插入状态：'+insertQuestions.affectedRows+'记录插入状态：'+record.affectedRows,
                        err:insertStatus.sqlMessage
                    }
                }
                data.push(result);
            }
            return data;
        }catch (err){
            this.logger.error(err);
            data={
                status:0,
                text:'新增失败',
                err:err
            }
            return data;
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
            var ds=new Date(data[i].startime.valueOf());
            var df=new Date(data[i].fintime.valueOf());
            var startime=(ds.getFullYear()) + "-" + this.addzero((ds.getMonth() + 1)) + "-" + this.addzero(ds.getDate()) + " " + this.addzero(ds.getHours()) + ":" + this.addzero(ds.getMinutes()) + ":" + this.addzero(ds.getSeconds());
            var fintime=(df.getFullYear()) + "-" + this.addzero((df.getMonth() + 1)) + "-" + this.addzero(df.getDate()) + " " + this.addzero(df.getHours()) + ":" + this.addzero(df.getMinutes()) + ":" + this.addzero(df.getSeconds());
            //console.log(startime,fintime);
            data[i].startime=startime;
            data[i].fintime=fintime;
        }
    }

    //查看作业以及问题
    async read(row,limit,page){
        var data,count,result;
        //console.log(row);
        data = await this.app.mysql.select('teach_inexper',{
            where:row,
            limit:limit,
            offset:(page - 1)*limit,
            columns:['name','id','week','course','fintime','startime','totaltime'],
            orders:[['id','desc']]
        })
        for(var i=0;i<data.length;i++){
            data[i].questions=await this.app.mysql.select('teach_questions',{
                where:{
                    root_id:data[i].id
                }
            })
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

        count= await this.app.mysql.select('teach_inexper',{
            where:row
        });
        if(data.length!==0){
            result={
                status:1,
                text:row.course+':查询成功',
                count:count.length,
                data:data
            }
        }else{
            result={
                status:0,
                data:data,
                text:row.course+':查询结果为空',
                count:count.length
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

    //更新作业，作业id，名字，课时，开始时间，结束时间
    async updatexper(id,name,week,startime,fintime,totaltime){
        try{
            var result;
            /*const istime=await this.app.mysql.select('teach_inexper',{
                where:{
                    id:id
                },
                columns:['startime']
            })
            console.log(istime[0].startime.valueOf(),Date.now());
            if(istime[0].startime.valueOf()>Date.now()){*/
            const row={
                name:name,
                week:week,
                startime:startime,
                fintime:fintime,
                totaltime:totaltime,
                surplustime:totaltime
            }
            const data=await this.app.mysql.update('teach_inexper',row,{
                where:{
                    id:id
                }
            });
            const updateStatus=data.affectedRows;//更新结果
            if(updateStatus===1){
                result={
                    status:1,
                    text:'更新成功',
                    success:updateStatus
                }
            }else{
                result={
                    status:0,
                    text:'更新失败',
                    err:updateStatus
                }
            }
            /*}else{
                result={
                    status:0,
                    text:'更新失败,在线作业已开始',
                }
            }*/
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

    //更新作业问题，作业id，名字，课时，开始时间，结束时间
    async update_question(questions){
        try{
            var StatusArray=[],StatusObject;
            const root_id=await this.app.mysql.select('teach_questions',{
                where:{
                    id:questions[0].id
                },
                columns:['root_id']
            })
            /*
            const istime=await this.app.mysql.select('teach_inexper',{
                where:{
                    id:root_id[0].root_id
                },
                columns:['startime']
            })
            console.log(istime[0].startime.valueOf(),Date.now());
            if(istime[0].startime.valueOf()>Date.now()){*/
            for(var i=0;i<questions.length;i++){
                const row={
                    context:questions[i].context,
                    first_option:questions[i].obj.first_option,
                    sec_option:questions[i].obj.sec_option,
                    third_option:questions[i].obj.third_option,
                    fourth_option:questions[i].obj.fourth_option,
                    type:questions[i].qtype,
                    answer:questions[i].answer,
                    grade:questions[i].grade,
                }
                const data=await this.app.mysql.update('teach_questions',row,{
                    where:{
                        id:questions[i].id
                    }
                });
                const updateStatus=data.affectedRows;//更新结果
                var result;
                if(updateStatus===1){
                    result={
                        status:1,
                        text:'第'+(i+1)+'条问题更新成功',
                    }
                }else{
                    result={
                        status:0,
                        text:'第'+(i+1)+'条问题更新失败',
                        err:data
                    }
                }
                StatusArray.push(result);
            }
            StatusObject={
                StatusArray:StatusArray
            }
            /*}else {
                StatusObject={
                    StatusArray:{
                        status:0,
                        text:'更新失败，在线作业已开始'
                    }
                }
            }*/
            console.log(StatusObject);
            return StatusObject;
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

    //删除作业，作业id
    async deletexper(id){
        try{
            const data=await this.app.mysql.delete('teach_inexper',{id:id});
            const deleteStatus=data.affectedRows;//删除结果
            var result;
            if(deleteStatus===1){
                result={
                    status:1,
                    text:'数据删除成功',
                }
            }else{
                result={
                    status:0,
                    text:'数据删除失败',
                    err:data
                }
            }
            console.log(result)
            //console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'数据删除失败',
                err:err
            }
            this.logger.error(err);
            console.log(result);
            return result;
        }
    }

    //删除作业问题，问题id
    async delete_question(id){
        try{
            const data=await this.app.mysql.delete('teach_questions',{id:id});
            const deleteStatus=data.affectedRows;//删除结果
            var result;
            if(deleteStatus===1){
                result={
                    status:1,
                    text:'数据删除成功',
                }
            }else{
                result={
                    status:0,
                    text:'数据删除失败',
                }
            }
            console.log(result)
            //console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'数据删除失败',
                err:err
            }
            this.logger.error(err);
            console.log(result);
            return result;
        }
    }

    //查看学生作业，用于改作业
    async readStuExper(teacher,semester,course,week,stuclass,exper_id,limit,page){
        try{
            var result,count,questions,stuanswers;
            const data=await this.app.mysql.select('stu_inexper',{
                where:{
                    stuclass:stuclass,
                    exper_id:exper_id,
                },
                columns:['id','student','stu_id','submit_time','surplus_time','status','grade'],
                limit:limit,
                offset:(page - 1)*limit,
                orders:[['id','desc']]
            });
            //console.log(data.length);
            for(var i=0;i<data.length;i++){
                questions=await this.app.mysql.select('teach_questions',{
                    where:{
                        root_id:exper_id
                    }
                });
                for(var j=0;j<questions.length;j++){
                    console.log(questions[j]);
                    stuanswers=await this.app.mysql.select('stu_questions',{
                        where:{
                            quest_id:questions[j].id,
                            root_id:data[i].id,
                        },
                        columns:['id','answer','grade']
                    });
                    questions[j].stuanswer=stuanswers[0] || { };
                    console.log('答案',questions[j].stuanswer)
                }
                data[i].questions=questions;
            }
            count=await this.app.mysql.select('stu_inexper',{
                where:{
                    stuclass:stuclass,
                    exper_id:exper_id,
                }
            })
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
                    count:count.length
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

    //作业评分,选项信息(id,grade)，学生作业id，总分数
    async registerScore(obj,id,grade){
        try{
            var data;
            var updataStatusArr=[];//小题评分状态
            for(var i=0;i<obj.length;i++){
                var questStatus,result;
                const row={
                    grade:obj[i].grade
                }
                questStatus=await this.app.mysql.update('stu_questions',row, {
                    where:{
                        id:obj[i].id
                    }
                });
                if(questStatus.affectedRows===1){
                    result={
                        status:'1',
                        text:'第'+(i+1)+'题评分成功'
                    }
                }else{
                    result={
                        status:'1',
                        text:'第'+(i+1)+'题评分失败'
                    }
                }
                updataStatusArr.push(result);
            }
            data=await this.app.mysql.update('stu_inexper',
                {
                    grade:grade
                },
                {
                    where:{
                        id:id
                    }
                });
            const updateStatus=data.affectedRows;//更新结果
            var result;
            if(updateStatus===1){
                result={
                    status:1,
                    text:'总分评分成功',
                    updataStatusArr:updataStatusArr
                }
            }else{
                result={
                    status:0,
                    text:'总分评分失败',
                    updataStatusArr:updataStatusArr
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

    //状态判断
    opertstatus(status,id,type){
        var result;
        if(status==1){
            result={
                status:status,
                text:'第'+id+'个操作：'+type+'，执行成功'
            }
        }else{
            result={
                status:status,
                text:'第'+id+'个操作：'+type+'，执行失败'
            }
        }
        return result;
    }
    //问题的增删改一体
    async quest_operation(id,arr){
        try{
            var result,add,update,del,statusArr=[];
            console.log(arr);
            /* const istime=await this.app.mysql.select('teach_inexper',{
                 where:{
                     id:id
                 },
                 columns:['startime']
             })
             //console.log(istime[0].startime.valueOf(),Date.now());
             if(istime[0].startime.valueOf()>Date.now()){*/
            for(var i=0;i<arr.length;i++){
                if(arr[i].type=='add'){
                    const data=await this.app.mysql.insert('teach_questions',{
                        root_id:arr[i].root_id,
                        context:arr[i].context,
                        first_option:arr[i].obj.first_option,
                        sec_option:arr[i].obj.sec_option,
                        third_option:arr[i].obj.third_option,
                        fourth_option:arr[i].obj.fourth_option,
                        type:arr[i].qtype,
                        answer:arr[i].answer,
                        grade:arr[i].grade
                    });
                    add = data.affectedRows;
                    result=this.opertstatus(add,(i+1),'新增');
                    statusArr.push(result);
                }else if(arr[i].type=='delete'){
                    const data=await this.app.mysql.delete('teach_questions',{id:arr[i].id});
                    del = data.affectedRows;
                    result=this.opertstatus(del,(i+1),'删除');
                    statusArr.push(result);
                }else if(arr[i].type=='update'){
                    const row={
                        context:arr[i].context,
                        first_option:arr[i].obj.first_option,
                        sec_option:arr[i].obj.sec_option,
                        third_option:arr[i].obj.third_option,
                        fourth_option:arr[i].obj.fourth_option,
                        type:arr[i].qtype,
                        answer:arr[i].answer,
                        grade:arr[i].grade,
                    }
                    const data=await this.app.mysql.update('teach_questions',row,{
                        where:{
                            id:arr[i].id
                        }
                    });
                    update=data.affectedRows;
                    result=this.opertstatus(update,(i+1),'更新');
                    statusArr.push(result);
                }else{
                    result={
                        status:0,
                        text:'第'+(i+1)+'个操作失败，无该类型'
                    }
                }
            }
            result={
                data:statusArr
            }
            /*}else {
                result={
                    status:0,
                    text:'操作失败,在线作业已开始',
                }
            }*/
            return result;
        }catch (err){
            this.logger.error(err);
            var result={
                status:0,
                text:'操作失败',
                err:err
            }
            console.log(result);
            return result;
        }
    }
}

module.exports = ExperService;