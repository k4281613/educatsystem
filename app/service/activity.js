// app/service/user.js
const Service = require('egg').Service;

class UserActivity extends Service {
 
   

async getActivity(id, offset, keyword) {
   
    const PageSize = 8
    let activity  =""
    let count=0
    if (keyword == "") {
       let  where = { u_id: id,status:[0,1]  }
     
     activity = await this.app.mysql.select('activity', {
        where, // WHERE 条件
        columns: ['id','title', 'postTime', 'status'], // 要查询的表字段
        orders: [['postTime', 'desc']], // 排序方式
        limit: PageSize, // 返回数据量
        offset: PageSize * offset, // 数据偏移量
      });

      count = await this.app.mysql.count('activity', where)

    } else {
      let sqlQuery = `select id,title,postTime,status from activity where  u_id='${id}'  and status in (0,1)  and  title like '%${keyword}%'  order by postTime desc limit ${offset*PageSize},${PageSize} `
      let countQuery =  `select count(*) as count from activity where  u_id='${id}'  and status in (0,1) and  title like '%${keyword}%' `
        
     activity = await this.app.mysql.query(sqlQuery);
     count = await this.app.mysql.query(countQuery);
     count = count[0].count
    }
      
    return {
      status: 1,
      activity,
      count
    };
  }






async delActivity(id) {
    const result = await this.app.mysql.delete('activity', {
     id
    });
    if (result.affectedRows === 1) {
      return {
        status: 1,
        message:"ok"
      };
    } else {
      return {
      status: 1,
        message:"fail"
      };
    }

  }


 async getActivityById(id) {
  
    const activity = await this.app.mysql.get('activity', {
      id
    });
    const detail = await this.app.mysql.get('activity_detail', {
       activity_id:id
    });
    const tags = await this.app.mysql.select('activity_tag', {
       where:{ activity_id:id}
    });

    if (activity) {
      return {
        status: 1,
        message:"ok",
        activity,
        detail,
        tags
      };
    } else {
      return {
        status: 1,
         message:"fail"
      };
    }

  }


async addActivityTag(activity_id,tag) {
    const data = await this.app.mysql.insert('activity_tag', {
       activity_id
       ,tag
    });

    if (data.affectedRows==1) {
      return {
        status: 1,
        message:"ok",
        id:data.insertId
      };
    } else {
      return {
        status: 1,
         message:"fail"
      };
    }
  }


 async delActivityTag(id) {
        const tag = await this.app.mysql.delete('activity_tag', {
            id 

        });

        if (tag.affectedRows == 1) {
            return {
                status: 1,
                message: "ok"
            };
        } else {
            return {
                status: 1,
                message: "fail"
            };
        }
    }



 async addActivity(content, addressInfo) {
        const u_id = content.u_id;
        const activity_id = content.activity_id;
        const title = content.title;
        const describe = content.describe;
        const cover = content.cover;
        const imgurl = content.imgurl;
        const time = content.time;
        const typeName = content.typeName;
        const number = content.number;
        const type = content.type;
        const address = addressInfo.position;
        const adcode = addressInfo.adcode;
        const traffic = addressInfo.traffic;
        const detail = content.content
        const postTime = Date.now()
        const lat = addressInfo.lat;
        const lng = addressInfo.lng;
        const status = content.status;
        let activity = ""
        let activityDetail = ""
        if (activity_id != 0) {
          
            activity = await this.app.mysql.update('activity', {
                u_id,
                title,
                describe,
                cover,
                address,
                time,
                traffic,
                type,
                typeName,
                postTime,
                lat,
                lng,
                status,
                number,
                imgurl,
                adcode

            },{
                where:{id:activity_id}
            });

             activityDetail = await this.app.mysql.update('activity_detail', {
                content: detail
            },{
                where:{activity_id:activity_id}
            });
            
      
        } else {
            activity = await this.app.mysql.insert('activity', {
                u_id,
                title,
                describe,
                cover,
                address,
                time,
                traffic,
                type,
                typeName,
                postTime,
                lat,
                lng,
                status,
                number,
                imgurl,
                adcode
            });
            activityDetail = await this.app.mysql.insert('activity_detail', {
                activity_id: activity.insertId,
                content: detail
            });
        }
           
        
        if (activity.affectedRows == 1 && activityDetail.affectedRows == 1) {
                return {
                    status: 1,
                    activity_id: activity.insertId,
                    message: "success"
                };
            } else {
                return {
                    status: 1,
                    message: "fail"
                };
            }
    }




}

module.exports = UserActivity;
