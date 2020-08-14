// app/service/user.js
const Service = require('egg').Service;

class Graduation extends Service {


    async getGraduationWork(u_id,name,page,size) {
       let offset = (page - 1) * size
       let graduationWorkList = null
       let counCon = null
      if(name){

        let where = "select g.*,t.username from graduation_design_list g join teacher t on g.tid=t.u_id  where t.username like '%?%' and g.status=1 order by t.username desc limit ?,?"
        graduationWorkList = await this.app.mysql.query(where,[name,offset,size])
       
        let counWhere = "select count(1) as count from graduation_design_list where username like '%?%' and status=1"
        counCon = await this.app.mysql.query(counWhere,[name])
       }else{
        let where = "select g.*,t.username from graduation_design_list g join teacher t on g.tid=t.u_id  where g.status=1 order by t.username desc limit ?,?"
        graduationWorkList = await this.app.mysql.query(where,[offset,size])

        let counWhere = "select count(1) as count from graduation_design_list  where status=1"
        counCon = await this.app.mysql.query(counWhere)
        }
    
         
        let myChoice = await this.app.mysql.select("graduation_work_choice", {
            where: { uid:u_id },
            columns: ["cid","status"]
        }) 

       let myAdd = await this.app.mysql.select("stu_graduation_work", {
            where: { uid:u_id }
        }) 
        let teacherSql = "select tid from have_choice where (uid=? or menber_id =?) and status=1 " 
        let myTeacher = await this.app.mysql.query(teacherSql,[u_id,u_id])
         
        let teacherName = ''
        
        if(myTeacher.length>0){
          let tid = myTeacher[0].tid
          let nameSql = "select username from teacher where u_id=?" 
          let getMyTeacherName = await this.app.mysql.query(nameSql,[tid])
          teacherName = getMyTeacherName[0].username
        }
     
        if (graduationWorkList) {
            return {
                status: 1,
                message:"ok",
                graduationWorkList,
                count:counCon[0].count,
                myChoice:myChoice,
                myAdd,
                myTeacher,
               teacherName
            };
        }else{
           return {
                status: 1,
              message:"fail"
            }; 
        }



    }




   async choiceGraduationWork(u_id,cid) {
       
  let addChoice = null

  for(let i=0;i<cid.length;i++){
     addChoice =  await this.app.mysql.insert('graduation_work_choice', {
      cid:cid[i],
      uid:u_id
    });

  }

   if(addChoice){
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

   async getTeacherName(tid) {
      

  let teacher  =  await this.app.mysql.get('teacher', {
      uid:tid
    });

   if(teacher&&user){
         return {
                tid:teacher.tid,
                name:teacher.username,
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

   async getMyPapper(uid,page,size,year) {
      
  let offset = size * (page-1) 
  let user  =  await this.app.mysql.get('system_user', {
      u_id:uid
    });
    
  if(!user.papper){
       return {
                status: 1,
                message: "noStart"
            };
   }

 let getTime  =  await this.app.mysql.get('graduation_start_time', {
      type:'papper',
      year
    });

 let papperList  =  await this.app.mysql.select('have_sub_papper', {
     where:{uid:uid},
     limit:size,
     offset
     
    });

 let countSql = 'select count(1) as count from have_sub_papper where uid=?'
  let getCount = await this.app.mysql.query(countSql,[uid])

   if(papperList){
         return {
                deadline:getTime.deadline,
                count:getCount[0].count,
                papperList,
                tid:user.guide_teacher,
                name:user.teacher_name,
                title:user.papper,
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


 async addGraduationWork(uid, major, tid,username, title, description,time) {
       
  let addGraduation =  await this.app.mysql.insert('stu_graduation_work', {
     major,
     uid,
     username,
     tid, 
     title, 
     content:description,
     time
    });

   if(addGraduation.affectedRows==1){
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


async getMissionStart(year,token,type) {
   
    const getTime =  await this.app.mysql.get('graduation_start_time', {
    },{where:{
       year,
      type}})

 const result = await this.app.mysql.select('mission_week_report', {
      where:{u_id:token,type}
    });

    if (getTime) {
      return {
        oldReport: result,
        message:"ok",
        startTime:getTime.time,
        status: 1,
      };
    } else {
      return {
         message:"fail",
         status: 1,
      };
    }
  }


  async submitWeekReport(token,time,week,status,content,save,more_time,type) {
   
    let delSql = 'delete from mission_week_report where u_id=? and week=? and type=?'
    var deleteOld = await this.app.mysql.query(delSql,[token,week,type])
   
     var result = await this.app.mysql.insert('mission_week_report', {
       u_id:token,
       time,
       week,
       status:0,
       more_time,
       content,
       type,
       save
      });
   
    

    if (result.affectedRows==1) {
      return {
       message:"ok",
       status: 1
      };
    } else {
      return {
        message:"fail",
        status: 1
      };
    }
  }



async getWeekReport(token){
    const result = await this.app.mysql.select('mission_week_report', {
      u_id:token
    });
    if (result) {
      return {
        result,
        status: 1,
        message:"ok"
      };
    } else {
      return {
        status: 0,
        message:"fail"
      };
    }

  }


async getMyMission(token, page, size) {   
   let offset = (page -1) * size
   let user = await this.app.mysql.get('system_user', {
       u_id:token
      });
   if(!user || !user.guide_teacher){
     return {
         status:1,
        message:'noChoice'
       
    };

    }
   let tid = user.guide_teacher
   let missions = await this.app.mysql.select('mission_list', {
        where:{tid},
        limit:size,
        offset
      });

   let myChoice = await this.app.mysql.select('complete_mission', {
        where:{uid:token}
      });

  let countSql = 'select count(1) as count from mission_list where tid=?'
  let getCount = await this.app.mysql.query(countSql,[tid])
    
   if(missions){

    return {
         status:1,
       myChoice,
        missions,
        count:getCount[0].count,
        message:'ok'
       
    };
   } else{
       return {
        status:1,
      message: "fail",
    };
   }  
  }


 async completeMission(id, token, file) {

       
        const newMission = await this.app.mysql.insert('complete_mission', {
            mid:id, uid:token, file
        });
   

        if (newMission.affectedRows==1) {
            return {
                status: 1,
                message:"ok",
            };
        } else {
            return {
               status: 1,
                message:"fail",
            };
        }
    }


async submitMyPapper( tid, uid,time, file){

  
        let addPapper = await this.app.mysql.insert('have_sub_papper', {
                tid, uid,time, file
            })
        


        if (addPapper.affectedRows==1) {
            return {
                status: 1,
                message: "ok",
            };
        } else {
            return {
                status: 1,
                message: "fail",
            };
        }
    }


}

module.exports = Graduation;
