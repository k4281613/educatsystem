// app/service/user.js
const Service = require('egg').Service;

class UserStrategy extends Service {
  async add (u_id,name,describe,cover,position,address,sellTime,traffic,type,typeName,postTime,lat,lng,status) {
      const user = await this.app.mysql.insert('discovery', {
         u_id,
         name,
         description:describe,
         cover,
         position,
         address,
         sellTime,
         traffic,
         type,
         typeName,
         postTime,
         lat,
         lng,
         status
      });
      return {
        status:1,
        discovery_id:user.insertId
      };
    }
    
     async addDetail (discovery_id,content) {
      const user = await this.app.mysql.insert('discovery_detail', {
        discovery_id,
         content
      });
      return {
        status:1
      };
    }

async getStrategy(id, offset, keyword) {
    const Literal = this.app.mysql.literals.Literal;
    const PageSize = 8
    let strategy  =""
    let count=0
    if (keyword == "") {
       let  where = { u_id: id,status:[0,1]  }
     strategy = await this.app.mysql.select('discovery', {
        where, // WHERE 条件
        columns: ['id','name', 'postTime', 'status'], // 要查询的表字段
        orders: [['postTime', 'desc']], // 排序方式
        limit: PageSize, // 返回数据量
        offset: PageSize * offset, // 数据偏移量
      });

      count = await this.app.mysql.count('discovery', where)

    } else {
      let sqlQuery = `select id,name,postTime,status from discovery where  u_id='${id}'  and status in (0,1)  and  name like '%${keyword}%'  order by postTime desc limit ${offset*PageSize},${PageSize} `
      let countQuery =  `select count(*) as count from discovery where  u_id='${id}'  and status in (0,1) and  name like '%${keyword}%' `
        
     strategy = await this.app.mysql.query(sqlQuery);
     count = await this.app.mysql.query(countQuery);
     count = count[0].count
    }
      

    return {
      status: 1,
      strategy,
      count
    };
  }


  async getStrategyById(id) {
  
    const strategy = await this.app.mysql.get('discovery', {
      id
    });
    const detail = await this.app.mysql.get('discovery_detail', {
        discovery_id:id
    });
   
    if (strategy) {
      return {
        status: 1,
        strategy,
        detail
      };
    } else {
      return {
        status: 0
      };
    }

  }



async delStrategy(id) {
    const result = await this.app.mysql.delete('discovery', {
     id
    });
    if (result.affectedRows === 1) {
      return {
        status: 1
      };
    } else {
      return {
        status: 0
      };
    }

  }



 async updateStrategy(content,address) {
    let id =content.id
  
    const user = await this.app.mysql.update('discovery', {
      name:content.name,
      status:content.status,
      describe:content.describe,
      cover:content.cover,
      position:address.position,
      address:address.adcode,
      sellTime:content.sellTime,
      traffic:address.traffic,
      type:content.strategyType,
      typeName:content.type,
      postTime:Date.now(),
      lat:address.lat,
      lng:address.lng
    },{
    where:{id:id}
    });
    return {
      status: 1,
   
    };
  }

 async updateDetail(discovery_id, content) {
    
    const user = await this.app.mysql.update('discovery_detail', {
      content
    },{
    where:{ discovery_id:discovery_id,}
    });

    return {
      status: 1
    };
  }


}

module.exports = UserStrategy;
