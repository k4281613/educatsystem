// app/service/user.js
const Service = require('egg').Service;

class Comment extends Service {
    async getComment(seller_id, offset, keyword, date, status) {
        const PageSize = 5
        let orders = ""
        let count = 0
        let u_id = await this.app.mysql.get("made_sellers", {
      seller_id
    })
  
    
    if(u_id==null){
          return {
            status:1,
           
        };
      }
      
    let id =u_id.id
   
        if (keyword == "" && status == -1 && date == "") {
            let where = { seller_id: id }
            orders = await this.app.mysql.select('made_seller_comments', {
                where, // WHERE 条件
                orders: [['rateTime', 'desc']], // 排序方式
                limit: PageSize, // 返回数据量
                offset: PageSize * offset, // 数据偏移量
            });

            count = await this.app.mysql.count('made_seller_comments', where)
        } else if (keyword == "" && status != -1 && date == "") {
            let where = { seller_id: id, status: status }
            orders = await this.app.mysql.select('made_seller_comments', {
                where, // WHERE 条件
                orders: [['rateTime', 'desc']], // 排序方式
                limit: PageSize, // 返回数据量
                offset: PageSize * offset, // 数据偏移量
            });

            count = await this.app.mysql.count('made_seller_comments', where)

        }
        else if (keyword == "" && status == -1 && date != "") {
            let starDate = new Date(date[0]).getTime()
            let endDate = new Date(date[1]).getTime()
            let sqlQuery = `select * from made_seller_comments where  seller_id='${id}'  and rateTime>${starDate} and rateTime<${endDate}  order by rateTime desc limit ${offset * PageSize},${PageSize} `
            let countQuery = `select count(*) as count from made_seller_comments where  seller_id='${id}'   and rateTime>${starDate} and rateTime<${endDate}  `
            orders = await this.app.mysql.query(sqlQuery);
            count = await this.app.mysql.query(countQuery);
            count = count[0].count

        }
        else if (keyword != "" && status == -1 && date == "") {
            let sqlQuery = `select * from made_seller_comments where  seller_id='${id}'  and concat(order_id,username,text)  like '%${keyword}%'  order by rateTime desc limit ${offset * PageSize},${PageSize} `
            let countQuery = `select count(*) as count from made_seller_comments where  seller_id='${id}'    and  concat(order_id,username,text) like '%${keyword}%' `
            orders = await this.app.mysql.query(sqlQuery);
            count = await this.app.mysql.query(countQuery);
            count = count[0].count

        }
        else if (keyword != "" && status != -1 && date == "") {
            let sqlQuery = `select * from made_seller_comments where  seller_id='${id}'  and status=${status} and concat(order_id,username,text)  like '%${keyword}%'  order by rateTime desc limit ${offset * PageSize},${PageSize} `
            let countQuery = `select count(*) as count from made_seller_comments where  seller_id='${id}'    and status=${status}  and  concat(order_id,username,text) like '%${keyword}%' `
            orders = await this.app.mysql.query(sqlQuery);
            count = await this.app.mysql.query(countQuery);
            count = count[0].count

        }
        else if (keyword != "" && status == -1 && date != "") {
            let starDate = new Date(date[0]).getTime()
            let endDate = new Date(date[1]).getTime()
            let sqlQuery = `select * from made_seller_comments where  seller_id='${id}' and rateTime>${starDate} and rateTime<${endDate} and concat(order_id,username,text)  like '%${keyword}%'  order by rateTime desc limit ${offset * PageSize},${PageSize} `
            let countQuery = `select count(*) as count from made_seller_comments where  seller_id='${id}'   and rateTime>${starDate} and rateTime<${endDate}  and  concat(order_id,username,text) like '%${keyword}%' `
            orders = await this.app.mysql.query(sqlQuery);
            count = await this.app.mysql.query(countQuery);
            count = count[0].count

        }
        else if (keyword == "" && status != -1 && date != "") {
            let starDate = new Date(date[0]).getTime()
            let endDate = new Date(date[1]).getTime()
            let sqlQuery = `select * from made_seller_comments where  seller_id='${id}' and rateTime>${starDate} and rateTime<${endDate} and status=${status}  order by rateTime desc limit ${offset * PageSize},${PageSize} `
            let countQuery = `select count(*) as count from made_seller_comments where  seller_id='${id}'   and rateTime>${starDate} and rateTime<${endDate} and status=${status} `
            orders = await this.app.mysql.query(sqlQuery);
            count = await this.app.mysql.query(countQuery);
            count = count[0].count

        }
        else if (keyword != "" && status != -1&& date != "") {
            let sqlQuery = `select * from made_seller_comments where  seller_id='${id}'  and status=${status} and rateTime>${starDate} and rateTime<${endDate}  and concat(order_id,username,text)  like '%${keyword}%'  order by rateTime desc limit ${offset * PageSize},${PageSize} `
            let countQuery = `select count(*) as count from made_seller_comments where  seller_id='${id}' and rateTime>${starDate} and rateTime<${endDate}   and status=${status}  and  concat(order_id,username,text) like '%${keyword}%' `
            orders = await this.app.mysql.query(sqlQuery);
            count = await this.app.mysql.query(countQuery);
            count = count[0].count
        }

        return {
            status: 1,
            comments:orders,
            count
        };
    }


  async reply(id, content) {
    const reply = await this.app.mysql.insert('made_seller_reply', {
     comment_id:id,
     content
    });
    const updateStatus = await this.app.mysql.update('made_seller_comments', {
     id:id,
     status:2
    });
    if(reply.affectedRows==1&&updateStatus.affectedRows==1){
      return {
      status: 1,
      message:"ok"
    };
    }else{
        return {
      status: 1,
      message:"fail"
    };  
    }
    
  }

  async getReply(id) {
    const reply = await this.app.mysql.select('made_seller_reply', {
     where:{comment_id:id}
    });
    
    if(reply){
      return {
      status: 1,
      message:"ok",
      reply
    };
    }else{
        return {
      status: 1,
      message:"fail"
    };  
    }
    
  }



}

module.exports = Comment;
