const path = require('path');
const fs = require('fs');
const awaitStreamReady = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

const UploadCourseFile = {
    async uploadFile(_this) {
        const ctx = _this.ctx;
        const parts = ctx.multipart();
        let part,
            file = [],
            field = {};
        // parts() 返回 promise 对象
        while ((part = await parts()) != null) {
            if (part.length) {
                field[part[0]] = part[1];
            } else {
                if (!part.filename) {
                    return
                }
                // 生成文件名
                const filename = Math.random().toString(36).substr(2) + Date.now() + path.extname(part.filename);
                // 文件存放在静态资源public/upload/course文件夹下
                const target = path.join(_this.config.baseDir, 'app/public/uploads/course', filename);
                // 写入流
                const writeStream = fs.createWriteStream(target);
                try {
                    // 写入文件
                    await awaitStreamReady(part.pipe(writeStream));
                    file.push({
                        filePath: 'http://www.kaolaplay.com:7002' + '/public/uploads/course/' + filename,
                        fileName: part.filename
                    })
                } catch ( err ) {
                    // 消费文件流
                    await sendToWormhole(part);
                    throw err;
                }
            }
        }
        if (file.length === 0) {
            ctx.body = {
                status: 0,
                message: 'fail'
            }
        }
        return {
            file,
            field
        }
    }
}


module.exports = UploadCourseFile;