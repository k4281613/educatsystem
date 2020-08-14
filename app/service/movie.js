// app/service/user.js
const Service = require('egg').Service;
const commentTree = require("../bin/CommentTree")
class Movie extends Service {
 
   
async getMovie(type, offset, keyword) {
   
    const PageSize = 8
    let movies  =""
    let count=0
    if (keyword == "") {
       let  where = {type}
     movies = await this.app.mysql.select('movie', {
        where, 
        orders: [['time', 'desc']], // 排序方式
        limit: PageSize, // 返回数据量
        offset: PageSize * offset, // 数据偏移量
      });

      count = await this.app.mysql.count('movie', where)

    } else {
      let sqlQuery = `select * from movie where  type='${type}'   and  title like '%${keyword}%'  order by time desc limit ${offset*PageSize},${PageSize} `
      let countQuery =  `select count(*) as count from movie where type='${type}' and  title like '%${keyword}%' `
        
     movies = await this.app.mysql.query(sqlQuery);
     count = await this.app.mysql.query(countQuery);
     count = count[0].count
    }
      
    return {
      status: 1,
     movies,
      count
    };
  }



   async addMoviePraise(uid, id) {

        var havePraise = await this.app.mysql.get("have_praise", {
            uid,
            mid: id
        })


        if (havePraise) {
            return {
                status: 1,
                message:2
            }
        } else {
            var addPraise = await this.app.mysql.insert("have_praise", {
                uid,
                mid: id
            })
            var sql = `update movie set praise = praise+1 where id=${id}`
            let updatePraise = await this.app.mysql.query(sql);
            if(addPraise.affectedRows==1&&updatePraise.affectedRows==1){
                return {
                    status:1,
                    message:1
                }
            }
        }
    }



    async addMovieComment(mid,text,avatar,name,rateTime,comment_user,parent_id,to_user,to_comment){

    var addComment = await this.app.mysql.insert("movie_comments", {
        username: name,
        avatar,
        mid,
        comment_user,
        rateTime,
        text,
        parent_id,
        to_user,
        to_comment
    })
       if(addComment.affectedRows==1){
              var sql = `update movie set ratings = ratings+1 where id=${mid}`
              let updatePraise = await this.app.mysql.query(sql);
                return {
                    status:1
                }
            }else{
               return {
                    status:0     
                }

            }

    }


async getMovieComment(id) {
        let comments = await this.app.mysql.select('movie_comments', {where:{
            mid: id
        }});
        if (comments) {
            if(comments.length>0){

               comments =  commentTree(comments,0,0)

            }
            
            return {
                status: 1,
                message: "ok",
                comments
            };
        } else {
            return {
                status: 0
            };
        }
    }


   async deleteMovie(id) {
        let item = await this.app.mysql.delete('movie',{
            id: id
        });
        if (item.affectedRows==1) {
            return {
                status: 1,
                message: "ok"
            };
        } else {
            return {
                status: 0
            };
        }
    }

 async updateMovie(form) {
       
    let newItem = ""

      if(form.id!=0){

        newItem =  await this.app.mysql.update('movie',{
             title:form.title,
             description:form.description,
             url:form.url,
             cover:form.cover,
             author:form.author,
             type:form.type,
             time:form.time
        },{where:{id:form.id}});

    }else{

    newItem =  await this.app.mysql.insert('movie',{
             title:form.title,
             description:form.description,
             url:form.url,
             cover:form.cover,
             author:form.author,
             type:form.type,
             time:form.time
        });

   }



        if (newItem.affectedRows==1) {
            return {
                status: 1,
                message: "ok"
            };
        } else {
            return {
                status: 0
            };
        }
    }



}

module.exports = Movie;
