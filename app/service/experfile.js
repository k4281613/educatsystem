const Service = require('egg').Service;
const fs = require('fs');
const archiver = require('archiver');
const path=require('path');
const sd = require("silly-datetime");

class ExperfileService extends Service {
    //删除本地文件
    async delfile(path){
        return new Promise(function (resolve, reject) {
            fs.unlink(path, function (err) {
                if(err){
                    var result={
                        status:0,
                        text:'本地文件删除失败',
                        err:err
                    }
                    console.log(result);
                    resolve(result);
                }else{
                    var result={
                        status:1,
                        text:'本地文件删除成功'
                    }
                    console.log(result);
                    resolve(result);
                }
            })
        })
    }
    //查看教师表,用于重新上传
    async readexper(id){
        try{
            const data=await this.app.mysql.select('teach_outexper',{
                where:{
                    id:id
                },
                columns:['localpath','webpath','localname']
            })
            var result={
                status:1,
                text:'查找成功',
                data:data
            }
            console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'查找失败',
                err:err
            }
            return result;
        }
    }
    //教师重新提交附件，更新路径信息
    async reuploadexper(id,localpath,localname,webpath){
        try{
            const row={
                localpath:localpath,
                webpath:webpath,
                localname:localname
            }
            const data=await this.app.mysql.update('teach_outexper',row,{
                where:{
                    id:id
                }
            })
            const reuploadStatus=data.affectedRows;//更新结果
            var result;
            if(reuploadStatus===1){
                result={
                    status:1,
                    text:'数据库更新成功',
                }
            }else{
                result={
                    status:0,
                    text:'数据库更新失败',
                }
            }
            //console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'数据库更新失败',
                err:err
            }
            this.logger.error(err);
            console.log(result);
            return result;
        }
    }
    //教师批量下载学生作业
    async BatchDownload(arr){
        try{
            var result;
            const ran = parseInt(Math.random() * 89 +10);
            const t = sd.format(new Date(),'YYYYMMDDHHmmss');
            const name=ran+t;
            //创建文件输出流
            let output = fs.createWriteStream(path.join(__dirname,'../public/uploads') + `/${name}.zip`)
            let archive = archiver('zip', {
                zlib: { level: 9 } // 设置压缩级别
            })
            // 文件输出流结束
            output.on('close', function() {
                console.log(`总共 ${archive.pointer()} 字节`)
                console.log('archiver完成文件的归档，文件输出流描述符已关闭');
            })
            // 数据源是否耗尽
            output.on('end', function() {
                console.log('数据源已耗尽')
            })
            // 存档警告
            archive.on('warning', function(err) {
                if (err.code === 'ENOENT') {
                    console.warn('stat故障和其他非阻塞错误')
                } else {
                    throw err
                }
            })
            // 存档出错
            archive.on('error', function(err) {
                throw err
            })
            // 通过管道方法将输出流存档到文件
            archive.pipe(output);
            for(var i=0;i<arr.length;i++){
                let myfile = path.join(__dirname,`../public/uploads/homework/${arr[i].localname}`);
                archive.append(fs.createReadStream(myfile), { name: arr[i].name })// 从流中追加文件
            }
            /*
            archive.file('file1.txt', { name: 'file4.txt' })// 追加一个文件
            archive.directory(path.join(__dirname,'../public/uploads/homework/'),'homework')//追加一个目录
             */
            //完成归档
            await archive.finalize();
            result={
                status: 1,
                text:'获取文件成功',
                filename:`${name}.zip`,
                filesize:archive.pointer(),
                filepath:`/public/upload/${name}.zip`,
                path:path.join(__dirname,'../public/uploads') + `/${name}.zip`
            }
            return result;
        }catch (err){
            console.log(err);
            var result={
                status:0,
                text:'文件压缩失败',
                err:err
            }
            return result;
        }
    }
    //查看学生表,用于重新上传
    async readStuexper(id){
        try{
            const data=await this.app.mysql.select('stu_outexper',{
                where:{
                    id:id
                },
                columns:['localpath','localname']
            })
            var result={
                status:1,
                text:'查找成功',
                data:data
            }
            console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'查找失败',
                err:err
            }
            return result;
        }
    }
    //学生重新提交附件，更新路径信息
    async resubexper(id,name,localname,localpath,webpath,submit_time){
        try{
            const row={
                name:name,
                localpath:localpath,
                webpath:webpath,
                localname:localname,
                submit_time:submit_time
            }
            const data=await this.app.mysql.update('stu_outexper',row,{
                where:{
                    id:id
                }
            })
            const reuploadStatus=data.affectedRows;//更新结果
            var result;
            if(reuploadStatus===1){
                result={
                    status:1,
                    text:'数据库更新成功',
                }
            }else{
                result={
                    status:0,
                    text:'数据库更新失败',
                }
            }
            //console.log(result);
            return result;
        }catch (err){
            var result={
                status:0,
                text:'数据库更新失败',
                err:err
            }
            this.logger.error(err);
            console.log(result);
            return result;
        }
    }
}

module.exports = ExperfileService;