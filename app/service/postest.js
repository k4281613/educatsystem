const Service = require('egg').Service;

class PostService extends Service {

    async findcourse(teacher){
        const course = await this.app.mysql.select('course',{
            where:{teacher:teacher},
            columns:['name']
        });
        return JSON.stringify(course);
    }
}

module.exports = PostService;