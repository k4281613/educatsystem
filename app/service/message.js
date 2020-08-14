// app/service/user.js
const Service = require('egg').Service;

class Message extends Service {
 
async getMessage(tid, start) {
   

    const PageSize = 4

    const offset = PageSize * (start-1)

    let count= []
  
    let sqlQuery = `select m.*,u.username,u.avatar from message_list m join teacher u on m.tid=u.u_id where m.tid=? or m.role='admin'  order by time desc limit ?,? `
    let countQuery =  `select count(*) as count from message_list where tid=? or role='admin'`
        
    let list = await this.app.mysql.query(sqlQuery,[tid,offset,PageSize]);
     count = await this.app.mysql.query(countQuery,[tid]);
   

      
    return {
      status: 1,
      list,
      count:count[0].count,
      message:'ok'
    };
  }

 async addNewNotice(title, description,time, notice,role) {

     const noticeItem = await this.app.mysql.insert('message_list',{
              title,
              content:description,
              tid:notice,
              time,
              uid:'',
              role,
     })
          

    if (noticeItem.affectedRows==1) {
      return {
        message: "ok",
        status: 1
      };
    } else {
      return {
        status: 1,
        message: "fail"
      };
    }

  }


async getNewMessage(uid) {
   
    let countQuery =  'select count(*) as count from message_list where tid=?  or role=?'
       
    let count = await this.app.mysql.query(countQuery,[uid,'admin']);
     count = count[0].count
   
      
    return {
      status: 1,
      count,
      message:'ok'
    };
  }



}

module.exports = Message;
