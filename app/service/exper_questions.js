'use strict';
const Service = require('egg').Service;

class QuestionService extends Service{
    async addQuestion(arr,teach_id,teacher){
        try{
            var result,data=[];
            for(var i=0;i<arr.length;i++){
                const insertStatus=await this.app.mysql.insert('exper_questions',{
                    course:arr[i].course,
                    Category:arr[i].Category,
                    type:arr[i].type,
                    context:arr[i].context,
                    first_option:arr[i].obj.first_option,
                    sec_option:arr[i].obj.sec_option,
                    third_option:arr[i].obj.third_option,
                    fourth_option:arr[i].obj.third_option,
                    answer:arr[i].answer,
                    grade:arr[i].grade
                })
                const GetId=await this.app.mysql.select('exper_questions',{
                    where:{
                        course:arr[i].course,
                        Category:arr[i].Category,
                        type:arr[i].type,
                        context:arr[i].context,
                        answer:arr[i].answer
                    }
                })
                const record=await this.app.mysql.insert('modifyrecord',{
                    teach_id:teach_id,
                    teacher:teacher,
                    operation:'新增题目',
                    course:arr[i].course,
                    Category:arr[i].Category,
                    quest_id:GetId[0].id
                });
                if(insertStatus.affectedRows==1){
                    result={
                        status:insertStatus.affectedRows,
                        text:"第"+(i+1)+'个题目添加成功,记录插入状态：'+record.affectedRows
                    }
                }else {
                    result={
                        status:insertStatus.affectedRows,
                        text:"第"+(i+1)+'个题目添加失败,记录插入状态：'+record.affectedRows
                    }
                }
                data.push(result);
            }
            return data;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据库插入失败',
                err:err
            }
            return result;
        }
    }
    async readQuestion(type,course,Category,limit,page){
        try{
            var result;
            const data=await this.app.mysql.select('exper_questions',{
                where:{
                    type:type,
                    course:course
                },
                limit:limit,
                offset:( page-1 )*limit,
                orders:[['id','desc']]
            });
            const count=await this.app.mysql.select('exper_questions',{
                where:{
                    type:type,
                    course:course
                }
            });
            if(count.length==0){
                result={
                    status:0,
                    text:'暂无数据',
                    data:data
                }
            }else {
                result={
                    status:1,
                    text:'查询成功',
                    data:data,
                    count:count.length
                }
            }
            return result;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据库插入失败',
                err:err
            }
            return result;
        }
    }
    async modifyStatus(obj1,obj2,data){
        for(let i in obj1){
            for(let j in obj2){
                if(i==j){
                    let result;
                    if(obj1[i]!=obj2[j]){
                        result={
                            key:i,
                            newtext:obj1[i],
                            oldtext:obj2[i],
                            bool:true
                        }
                    }else {
                        result={
                            key:i,
                            newtext:obj1[i],
                            oldtext:obj2[i],
                            bool:false
                        }
                    }
                    data.push(result);
                    break;
                }
            }
        }
    }
    async updateQuestion(id,course,Category,context,obj,answer,grade,teach_id,teacher){
        try{
            var result,MyStatus=[];
            const row={
                course:course,
                Category:Category,
                context:context,
                first_option:obj.first_option,
                sec_option:obj.sec_option,
                third_option:obj.third_option,
                fourth_option:obj.fourth_option,
                answer:answer,
                grade:grade
            }
            const oldata=await this.app.mysql.select('exper_questions',{
                where:{
                    id:id
                }
            })
            await this.modifyStatus(row,oldata[0],MyStatus);
            console.log(MyStatus);
            var myOperation='修改内容：';
            for (var i=0;i<MyStatus.length;i++){
                if(MyStatus[i].bool==true){
                    myOperation=myOperation+MyStatus[i].key+'('+MyStatus[i].oldtext+'→'+MyStatus[i].newtext+');';
                }
            }
            const updateStatus=await this.app.mysql.update('exper_questions',row,{
                where:{
                    id:id
                }
            });
            var recordStatus='0(无修改内容不插入)';
            if(myOperation!=='修改内容：'){
                const record=await this.app.mysql.insert('modifyrecord',{
                    teach_id:teach_id,
                    teacher:teacher,
                    operation:myOperation,
                    course:course,
                    Category:Category,
                    quest_id:id
                });
                recordStatus=record.affectedRows
            }
            if(updateStatus.affectedRows==0){
                result={
                    status:0,
                    text:'更新失败,记录插入状态：'+recordStatus
                }
            }else {
                result={
                    status:1,
                    text:'更新成功,记录插入状态：'+recordStatus
                }
            }
            return result;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据库更新失败',
                err:err
            }
            return result;
        }
    }
    async deleteQuestion(id,teach_id,teacher){
        try{
            var result;
            const dataMsg=await await this.app.mysql.select('exper_questions',{
                where:{
                    id:id
                }
            });
            const deleteStatus=await this.app.mysql.delete('exper_questions',{id:id});
            const record=await this.app.mysql.insert('modifyrecord',{
                teach_id:teach_id,
                teacher:teacher,
                operation:'删除题目',
                course:dataMsg[0].course,
                Category:dataMsg[0].Category,
                quest_id:id,
            });
            if(deleteStatus.affectedRows==0){
                result={
                    status:0,
                    text:'删除失败,记录插入状态：'+record.affectedRows
                }
            }else {
                result={
                    status:1,
                    text:'删除成功,记录插入状态：'+record.affectedRows
                }
            }
            return result;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据库删除失败',
                err:err
            }
            return result;
        }
    }
    async searchQuestion(condition,type,course,Category,limit,page){
        try{
            var result;
            const data=await this.app.mysql.query('select * from exper_questions where concat(`Category`,`context`) like ? and type = ? and course = ? limit ? offset ? ',[('%' + condition + '%'),type,course,limit,( page-1 )*limit]);//小类Category待添加
            const count=await this.app.mysql.select('exper_questions',{
                where:{
                    course:course,
                    type:type
                }
            })
            if(count.length==0){
                result={
                    status:0,
                    text:'暂无数据',
                    data:data
                }
            }else {
                result={
                    status:1,
                    text:'搜索成功',
                    data:data,
                    count:count.length
                }
            }
            return result;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据库查询失败',
                err:err
            }
            return result;
        }
    }
    async getCategoryList(course){
        try{
            var data=[],result;
            var CategoryList=await await this.app.mysql.select('exper_questions',{
                where:{
                    course:course
                },
                columns:['Category']
            });
            //累计器去重
            let hash = {};
            CategoryList = CategoryList.reduce((preVal, curVal) => {
                hash[curVal.Category] ? '' : hash[curVal.Category] = true && preVal.push(curVal);
                return preVal
            }, [])
            //console.log(CategoryList);
            for (var i=0;i<CategoryList.length;i++){
                data.push(CategoryList[i].Category);
            }
            result={
                status:1,
                text:'获取成功',
                data:data
            }
            return result;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据库获取失败',
                err:err
            }
            return result;
        }
    }
    addzero(time) {
        if (time < 10) {
            time = '0' + time;
        }
        return time;
    }
    async filteTime(data) {
        for (var i = 0; i < data.length; i++) {
            //console.log("修改前：",data[i].startime,data[i].startime.valueOf());
            var ds = new Date(data[i].time.valueOf());
            var time = (ds.getFullYear()) + "-" + this.addzero((ds.getMonth() + 1)) + "-" + this.addzero(ds.getDate()) + " " + this.addzero(ds.getHours()) + ":" + this.addzero(ds.getMinutes()) + ":" + this.addzero(ds.getSeconds());
            data[i].time = time;
        }
    }
    async getmodifyList(course,limit,page){
        try{
            var result;
            var modifyList=await await this.app.mysql.select('modifyrecord',{
                where:{
                    course:course
                },
                orders:[['id','desc']],
                limit:limit,
                offset:( page-1 )*limit,
            });
            const count=await await this.app.mysql.select('modifyrecord',{
                where:{
                    course:course
                }
            });
            await this.filteTime(modifyList);
            if(count.length==0){
                result={
                    status:0,
                    text:'获取失败，暂无数据',
                    data:modifyList
                }
            }else {
                result={
                    status:1,
                    text:'获取成功',
                    data:modifyList,
                    count:count.length
                }
            }
            return result;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据库获取失败',
                err:err
            }
            return result;
        }
    }
}
module.exports=QuestionService;