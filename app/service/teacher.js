// app/service/user.js
const Service = require('egg').Service;
const shal = require("sha1")
const psStr  = "user-admin@$%*JJD"
class Teacher extends Service {


  async getTeacherList(token,page,size) {
    let offset = (page - 1) *  size

    let countSql = `select count(1) as count from teacher`

    const getCount = await this.app.mysql.query(countSql)

    const teachers = await this.app.mysql.select('teacher', {
        where:{guide:1},
        columns:['u_id','username','major','experient','phone','people','haveChoice','time','description','level','avatar'],
        limit:size,
        offset
    });

     let sql = 'select tid from have_choice where uid=? or menber_id=?'
    const myChoice = await this.app.mysql.query(sql,[token,token])

     let TSql = 'select guide_teacher from system_user where u_id=?'

    const myGuideTeacher = await this.app.mysql.query(TSql,[token])

    

    if (teachers&&myChoice) {
      return {
        count:getCount[0].count,
        guide_teacher:myGuideTeacher[0].guide_teacher,
        teachers,
        myChoice,
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



  async getStudentList( tid,year) {

   
      let sql = 'select * from have_choice where tid=? and year=? and status=1'

      const myChoice = await this.app.mysql.query(sql,[tid,year])
       let studentList = []
      if(myChoice.length==0){
       return {
        status: 1,
        message: "none",
        studentList:[]
      };

      }
     
     let count = 0
     for(let i = 0;i<myChoice.length;i++){
       let uid = myChoice[i].uid 
       let mid = myChoice[i].menber_id?myChoice[i].menber_id:''
       let user = await this.app.mysql.get('system_user', {
           u_id:uid,
         });
       count++
       studentList.push({
        u_id:user.u_id,
        username: user.username,
        major: user.major,
        phone: user.phone,
        lesson: user.content?user.content:'',
        team_id: user.team_id?user.team_id:0,
        avator: user.avatar,
        name:  user.username,
        stu_number:  user.stu_number?user.stu_number:user.code,
        qq:user.qq,
        class: user.class,
        work_type: user.work_type,
        papper: user.papper,
        })
       let menber = await this.app.mysql.get('system_user', {
           u_id:mid,
         });
       if(menber){
        studentList.push({
         u_id:menber.u_id,
        username: menber.username,
        major: menber.major,
        phone: menber.phone,
        lesson: menber.content?menber.content:'',
        team_id: menber.team_id?menber.team_id:0,
        avator: menber.avatar,
        name:  menber.username,
        stu_number: menber.stu_number,
        qq:menber.qq,
        class: menber.class,
        work_type: menber.work_type,
        papper: menber.papper,
         })
         count++
         }
     }


    if (studentList) {
      return {
        count:count,
        studentList,
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


  async getMenber(name) {

     let sql = `select username,stu_number,major,u_id,team_id from system_user where username like '%${name}%'`

     const userList = await this.app.mysql.query(sql)
          

    if (userList) {
      return {
        userList,
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



 async deleteTeacherInfo(u_id) {

    

     const info = await this.app.mysql.delete('teacher',{
                 u_id
        })
          

    if (info.affectedRows==1) {
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


 async deleteMission(id) {

  
     const info = await this.app.mysql.delete('mission_list',{
                id
        })
          

    if (info.affectedRows==1) {
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



async updateTeacherInfo(form) {

    

     const info = await this.app.mysql.update('teacher',{
          description: form.description,
          level: form.level,
          code: form.code,
          experient: form.experient,
          username: form.username,
          major: form.major,
          phone: form.phone,
          qq: form.qq,
          people:form.people,
          guide: form.guide,

        },{where:{u_id:form.u_id}})
         

    if (info.affectedRows==1) {
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



async updatePs(code,password,newps) {

 
    const userItem = await this.app.mysql.get('teacher',{
           code
     })
    console.log(password,shal(shal(password)+psStr+userItem.salt),userItem.u_id)
    if(!userItem||shal(shal(password)+psStr+userItem.salt)!=userItem.password){

      return {
        status: 1,
        message: "fail"
      };

    }


     let  newPassword  = shal(shal(newps)+psStr+userItem.salt)
 
     const updateItem = await this.app.mysql.update('teacher',{
           password:newPassword
     },{where:{code}})
          

    if (updateItem.affectedRows==1) {
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
 




  async addNewTeacher(teacher) {

     let item = ''

     for(let i=0;i<teacher.length;i++){

    let salt = shal(new Date().getTime()+parseInt(Math.random()*999999))
    let password = shal(shal('teacher'+teacher[i].code)+psStr+salt)
    let u_id =  shal(shal(teacher[i].code)+psStr+password+salt)
    let avatar = "https://media.kaolaplay.com/1508291035500.png"
      item = await this.app.mysql.insert('teacher',{
               u_id,
               salt,
               password,
               avatar,
               time:teacher[i].time,
               code:teacher[i].code,
               username:teacher[i].username,
               major:teacher[i].major,
               level:teacher[i].level,
               experient:teacher[i].experient,
               phone:teacher[i].phone,
               qq:teacher[i].qq,
               role:teacher[i].role,
               people:teacher[i].people,
               description:teacher[i].description,
               guide:teacher[i].guide
        })

      }

   
          

    if (item.affectedRows==1) {
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

  async updateTime( time,beginDate,endDate,type, post_time){

          
     const newItem = await this.app.mysql.update('graduation_start_time',{
           year:time, 
           time:beginDate,
           deadline:endDate,
           post_time
       },{
         where:{type}
       })
    if (newItem.affectedRows==1) {
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

 async getSetTime() {

     const times = await this.app.mysql.select('graduation_start_time',{
        orders:[['post_time','desc']]
      })
          

    if (times) {
      return {
        times,
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


  async updateTeacherStudent(id,uid,menber_id,tid,teacher_name) {

     const updateItem1 = await this.app.mysql.update('have_choice',{
         status:-1
        },{where:{uid:uid}})

    const updateItem = await this.app.mysql.update('have_choice',{
         status:1
        },{where:{id:id}})
          

 const updateUser = await this.app.mysql.update('system_user',{
         guide_teacher:tid,
         teacher_name:teacher_name
        },{where:{u_id:uid}})
  
  let updateSql = 'update teacher set people = people-1 where u_id=?'

 const updateTeacherPeople = await this.app.mysql.query(updateSql,[tid])

   if(menber_id){

    const updateMenber = await this.app.mysql.update('system_user',{
         guide_teacher:tid,
         teacher_name:teacher_name
        },{where:{u_id:menber_id}})

    if (updateMenber.affectedRows!=1) {

       return {
        status: 1,
        message: "fail"
      };
     }
    let updateSql1 = 'update teacher set people = people-1 where u_id=?'

    const updateTeacherPeople1 = await this.app.mysql.query(updateSql1,[tid])
    }

    if (updateItem.affectedRows==1&&updateUser.affectedRows==1) {
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

  async updateCourseStatus(cid,status) {

  
     const updateItem = await this.app.mysql.update('graduation_design_list',{
         status:status
        },{where:{id:cid}})
          

    if (updateItem.affectedRows==1) {
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


 async getAllTeacher(page,size) {

     let offset = (page-1) * size
     const teacherList = await this.app.mysql.select('teacher',{
         colunms:['code','u_id','username','major','description','level','experient','phone','time','people'],
         orders:[['time','desc']],
         limit:size,
         offset
       })
      let sql = 'select count(1) as count from teacher'

      const countItem = await this.app.mysql.query(sql)    

    if (teacherList){
      return {
        count:countItem[0].count,
        teacherList,
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

 async haveTeacherStudent(tid, page, size) {
     let offset = (page-1) * size
     let stuSql = 'select s.username,t.id,t.menber_id,t.is_team,t.file,s.stu_number,s.class,s.major,s.phone,s.qq,t.status,t.uid from  have_choice t join system_user s on t.uid=s.u_id where t.tid=? limit ?,?'
     const students = await this.app.mysql.query(stuSql,[tid,offset, size])
      let sql = 'select count(1) as count from have_choice where tid=?'
      const countItem = await this.app.mysql.query(sql,[tid])    

    if (students){
      return {
        count:countItem[0].count,
        students,
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


  async confirmMission(id,uid,pass) {
     
      let sql = `update complete_mission set status=${pass} where mid=${id} and uid='${uid}'`
     const updateItem = await this.app.mysql.query(sql)
          

    if (updateItem.affectedRows==1) {
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


  async addNewMission(title, description,upload,download, token, file,time,deadline,name) {


     const mission = await this.app.mysql.insert('mission_list',{
           title, 
           content:description,
           upload,
           download, 
           tid:token, 
           file,
          time,
          deadline,
          name  
       })
          

    if (mission.affectedRows==1) {
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


 async getTeacherMission(token, page, size) {
       let offset = (page-1) * size
      const missions = await this.app.mysql.select('mission_list',{
           where:{tid:token}, 
           orders:[['time','desc']],
           limit:size,
           offset
      })
          

    if (missions) {
      return {
        missions,
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




 async addMyGraduation(tid, classType, majorType, title, description, time) {

    
     const add = await this.app.mysql.insert('graduation_design_list',{
           tid, 
           year:classType, 
           major:majorType, 
           title, 
           content:description, 
           time  
      })
          

    if (add.affectedRows==1) {
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

 async getMyGraduationList(u_id, page, size) {

       let countSql = `select count(1) as count from graduation_design_list where  tid=?`
       const countItem = await this.app.mysql.query(countSql,[u_id])
   
      let offset = (page-1) * size
     const courseList = await this.app.mysql.select('graduation_design_list',{
           where:{tid:u_id},
           orders:[['time','desc']],
          limit:size,    
          offset
      })
          

    if (courseList) {
      return {
        count:countItem[0].count,
        courseList,
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


 async updatePapper( papper_id,content,status, time) {
    
    if(status==1){
      let updatesql = `update have_sub_papper set status=1 where id=?`
       const updatePapper = await this.app.mysql.query(updatesql,[papper_id])
     if (updatePapper.affectedRows==1) {
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

     let updatePapperSql = `update have_sub_papper set status=-1,tip=?,update_time=? where id=?`
       const updateItem = await this.app.mysql.query(updatePapperSql,[content,time,papper_id])

    if (updateItem.affectedRows==1) {
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



  async confirmStudentCourse(id,uid) {

     let updatesql = `update graduation_work_choice set status=-1 where uid=?`

     const updatelist = await this.app.mysql.query(updatesql,[uid])


     let sql = `update graduation_work_choice set status=1 where cid=? and uid=?`

     const list = await this.app.mysql.query(sql,[id,uid])


     let updatemysql = `update stu_graduation_work set status=-1 where uid=?`

     const  updatemyList = await this.app.mysql.query(updatemysql,[uid])

    let mysql = `update stu_graduation_work set status=1 where id=? and uid=?`

     const  myList = await this.app.mysql.query(mysql,[id,uid])
          

    if (list||myList) {
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


  async getStudentCourse(uid){

     let sql = 'select g.*,c.status,c.uid from graduation_work_choice c join graduation_design_list g on c.cid = g.id where  c.uid=?'

     const normalList = await this.app.mysql.query(sql,[uid])

     let MySql = 'select * from stu_graduation_work  where  uid=?'

     const myList = await this.app.mysql.query( MySql,[uid])
          

    if (normalList&&myList) {
      return {
        workList:normalList.concat(myList),
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


  async updateScore(uid, type, week, score) {

     let sql = 'update mission_week_report set status=2 , score=? where u_id=? and week=? and type=?'

     const updateItem = await this.app.mysql.query(sql,[score,uid, week, type])
          

    if (updateItem.affectedRows==1) {
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


  async choiceTeacher(token, tid, menber_id,year, phone, qq, workType, menber_phone, menber_qq, menber_woker,menber_ps,team, file) {

  const getChoice = await this.app.mysql.get('have_choice', {
      uid:token
    })

    if (getChoice) {
      return {
        message: "haveChoice",
        status: 1
      };
    }

   const menberChoice = await this.app.mysql.get('have_choice', {
      menber_id:token
    })

    if (menberChoice) {
      return {
        message: "menberChoice",
        status: 1
      };
    }

    if(team==1){

    const userSalt = await this.app.mysql.get('system_user', {
      u_id:menber_id,
    });
     
   const oldSalt = userSalt?userSalt.salt:''
   const user = await this.app.mysql.get('system_user', {
       u_id:menber_id,
       password:shal(shal(menber_ps)+psStr+oldSalt)
    });

     if(!user){
        return{
         status:1,
         message:"psError"
        }
    }
   }

    let contentData = null
    let team_id = shal(token+menber_id+parseInt(Math.random()*9999))

  for(let i=0;i<tid.length;i++){
   let teacher_id =  tid[i]
  let addChoice = await this.app.mysql.insert('have_choice',{
      tid:teacher_id,
      year,
      uid:token,
      menber_id,
      file,
      is_team:team,
      team_id
    });
    let sqlChoice = `update teacher set haveChoice=haveChoice+1 where u_id='${teacher_id}'`
    let updateChoiceNumber = await this.app.mysql.query(sqlChoice)
    }
    
   let updateLeaderTeamId = await this.app.mysql.update('system_user', {
     team_id,
     phone,
     work_type:workType, 
     qq
    },{
     where:{
       u_id:token,
    }
   })
    if(team==1){
    let updateMenberTeamId = await this.app.mysql.update('system_user', {
     team_id,
     phone:menber_phone,
     work_type:menber_woker,  
     qq:menber_qq
    },{
     where:{
       u_id:menber_id,
    }
   })

    }
    if (updateLeaderTeamId.affectedRows == 1) {
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


  async haveChoiceStudent(tid) {
    
    var choiceSql1 = `select u.*,c.status,c.is_team,c.uid as leader from have_choice c join system_user u on c.uid=u.u_id  where c.tid='${tid}' and c.status=1`

    let leadHaveChoice = await this.app.mysql.query(choiceSql1)

     var choiceSql2 = `select u.*,c.status from have_choice c join system_user u on c.menber_id=u.u_id  where c.tid='${tid}' and c.is_team=1 and c.status=1`

    let  menberHaveChoice = await this.app.mysql.query(choiceSql2)

    let myCourse = await this.app.mysql.select('graduation_design_list', {
          where:{tid}
    })

    if (leadHaveChoice&&menberHaveChoice) {
      return {
        myCourse,
        student:[...leadHaveChoice,...menberHaveChoice],
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


}

module.exports = Teacher;
