const Service = require('egg').Service;

class IoService extends Service {
    async joinroom(id,status,submit_time,room){
        try{
            var result;
            const row={
                status:status,
                submit_time:submit_time
            }
            const updateStatus=await this.app.mysql.update('stu_inexper',row,{
                where:{
                    id:id
                }
            })
            if(updateStatus.affectedRows===1){
                result={
                    status:1,
                    room:room,
                    text:`开始在房间(${room})进行在线作业`,
                }
            }else{
                result={
                    status:0,
                    text:'当前作业不存在',
                    err:updateStatus.message
                }
            }
            return result;
        }catch (err){
            this.logger.error(err);
            const result={
                status:0,
                text:'数据提交失败',
                err:err
            }
            return result;
        }
    }
    async heartmove(id,clients){
        var result,bool=false;
        //console.log(id,clients);
        for(var i=0;i<clients.length;i++){
            if(id==clients[i]){
                bool=true;
                result={
                    id:id,
                    bool:bool,
                    text:'用户在线'
                }
                return result;
            }
        }
        result={
            id:id,
            bool:bool,
            text:'用户已离线'
        }
        return result;
    }
}

module.exports = IoService;