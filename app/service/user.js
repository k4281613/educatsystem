// app/service/user.js
const Service = require('egg').Service;
const shal = require("sha1")
var md5 = require('md5');
var axios = require("axios")
var crypto = require('crypto');
var Iconv = require('iconv-lite');
var cheerio = require('cheerio');  
const psStr  = "user-admin@$%*JJD"
const session = "$(%*$FJHDHDJ"
class UserService extends Service {

   async refreshCourse(username, password) {
   
    const sessionID = shal(shal(session+parseInt(Math.random()*999999)))
    const url = "http://class.sise.com.cn:7001/sise/"
    const uidUrl = "http://class.sise.com.cn:7001/sise/login_check_login.jsp"
    var schedularUrl = "http://class.sise.com.cn:7001/sise/module/student_schedular/student_schedular.jsp";

     var loginForm = await this.app.curl(url, {
      dataType: "text"
    })

    var preg_first_name = /<input type="hidden" name=\"(.*?)\"  value=\"(.*?)\">/
    var ipmd5Data = preg_first_name.exec(loginForm.data);
    var newipmd5 = ipmd5Data[0]
    var ipmd5 = newipmd5.substr(newipmd5.indexOf("name=") + 6, 32)
    var  ipsisemd5= newipmd5.substr(newipmd5.indexOf("value=") + 7, 32)
  
    var preg_name = /<input id=\"random\"   type=\"hidden\"  value=\"(.*?)\"  name=\"random\" \/>/
    var res = preg_name.exec(loginForm.data);
    var dataInput = res[0]
    var random = dataInput.substr(dataInput.indexOf("value=") + 7, 13)
    
    var secreString = sessionID + random
   
    var value =crypto.createHash('md5').update(secreString, 'utf8').digest('hex');
        value = value.toUpperCase()
    var valueLen = value.length
    var randomlen = random.length
    var token = '';
    for (let index = 0; index < valueLen; index++) {
      token += value[index];
      if (index < randomlen) {
        token += random[index];
      }
    }

   var postData = {
       username,
       password
     }
     postData[ipmd5] = ipsisemd5

    
    let result = await this.app.curl(uidUrl, {
      method: "POST",
      data: postData,
      dataType:"text"
    });
    if(result.data.indexOf("<script>top.location.href='/sise/index.jsp'</script>")==-1){
       
        return{
            status:1,
            message:"err"
        }

      
    }

 
  var resCookie = result.headers["set-cookie"]

    let results = await this.app.curl(schedularUrl, {
     headers:{
      
        Cookie:resCookie
    }
    });
  var content =  Iconv.decode(results.data, 'gb2312').toString()
  var $ =  cheerio.load(content,{
              xml:{normalizeWhitespace:true}
             });  
    
    
     var classInfo =  $('.font12').text()
       
      
     classInfo = classInfo.substr(classInfo.indexOf('星期日')+3)

    if (classInfo) {

   const userSalt = await this.app.mysql.get('system_user', {
      stu_number:username,
    });

   const oldSalt = userSalt?userSalt.salt:''
   
    await this.app.mysql.update('system_user', {
      content:classInfo
    },{
     where:{
      stu_number:username,
      password:shal(shal(password)+psStr+oldSalt)
    }
   });
      return {
        message:'ok',
        status: 1,
        content:classInfo
      }
    } else {

      return {
        status: 0
      }
    }
  }

  async getHistory(team_id) {
    let historys = await this.app.mysql.select("history_record", {
        where:{team_id}
    })

    if (historys) {
      return {
        status: 1,
        message: "ok",
        historys
      };
    } else {
      return {
        status: 1,
        message: "fail"
      };
    }
  }

 async updateInfo(token,role,content,type){
     
      let table = "system_user"

       if(role=='teacher'||role=='admin'){
          table = 'teacher'
        }
     let updateContent = ''
      if(type=='avatar'){
         updateContent = await this.app.mysql.update(table, {
         avatar:content
          },{where:{ u_id:token}})
       }
    
     if(type=='qq'){
          updateContent = await this.app.mysql.update(table, {
         qq:content
          },{where:{ u_id:token}})

       }

      if(type=='phone'){
      updateContent = await this.app.mysql.update(table, {
         phone:content
          },{where:{ u_id:token}})

       }
    

    if (updateContent.affectedRows==1) {
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

async getContentDetail(id) {
    let content = await this.app.mysql.select("system_user", {
        where:{id},
        colums:['content'],
        limit:1
    })

    if (content) {
      return {
        status: 1,
        message: "ok",
       content:content[0]
      };
    } else {
      return {
        status: 1,
        message: "fail"
      };
    }
  }


  async getWeekReport(team_id) {
    let reports = await this.app.mysql.select("week_report", {
      where: { team_id }
    })

    if (reports) {
      return {
        status: 1,
        message: "ok",
        reports
      };
    } else {
      return {
        status: 1,
        message: "fail"
      };
    }

  }



async getChatInfo(id) {

        let user = await this.app.mysql.get("wang_user", {
            u_id: id
        })
        
        if (user) {
            return {
                status: 1,
                message:"ok",
                user
            };
        }else{
           return {
                status: 1,
              message:"fail"
            }; 
        }



    }



  async  addWeekReport(uid, name, content, postTime,team_id) {

    const newReport = await this.app.mysql.insert('week_report', {
      uid, name, content, postTime,team_id
    });

    if (newReport.affectedRows == 1) {
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


async updateWork(sid,type,url,team_id,name,text) {

  if(type=="work"){

    var updateWork = await this.app.mysql.update('system_user', {
       work:url
        }, {
        where: {
           id: sid
       }
      });

  
    }else if(type=="paper"){

    var updateWork = await this.app.mysql.update('system_user', {
       paper:url
        }, {
        where: {
           id: sid
       }
      });
   
    }
        
  if (updateWork.affectedRows==1) {
  
      await this.app.mysql.insert("history_record", {
          team_id,
          text,
          name
         })
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




           



  async getTeamList(id) {
    let team = await this.app.mysql.select("system_user", {
      where: { team_id: id }
    })

    if (team) {
      return {
        status: 1,
        message: "ok",
        team
      };
    } else {
      return {
        status: 1,
        message: "fail"
      };
    }

  }



 async getInfo(token,role) {
    let table = role=='teacher'|| role=='admin'?'teacher':'system_user'
    const user = await this.app.mysql.get(table, {
      u_id:token
    });
     const startTime = await this.app.mysql.get('graduation_start_time', {
      type:'choice'
    });
    if (user) {
      return {
        choiceBegin:startTime.year,
        major: user.major,
        phone: user.phone,
        lesson: user.content?user.content:'',
        team_id: user.team_id?user.team_id:0,
        avator: user.avatar,
        name:  user.username,
        stu_number:  user.stu_number?user.stu_number:user.code,
        status: 1,
        access:user.role,
        class: user.class,
        qq:user.qq,
        teacher_name:user.teacher_name,
        guide_teacher:user.guide_teacher?user.guide_teacher:'',
        papper:user.papper,
        experient:user.experient,
        description:user.description,
        level:user.level,
        role:user.role,
        message:'ok'
        
      }
    } else {
      return {
        status: 1,
         message:'fail'
      }
    }
  }


 async unlock(token,username,password,role) {

   let table = 'teacher'


   if(role=='student'){
     
     table = 'system_user'
    }
      
    const userSalt = await this.app.mysql.get(table, {
      u_id:token,
    });

     if(!userSalt){
      return {
        status: 1,
         message:"fail"
      }
     }

  
       password = shal(shal(password)+psStr+userSalt.salt)

      let uid =  shal(shal(username)+psStr+password+userSalt.salt)

  

    if (uid == token) {

      return {
       status:1,
       message:'ok'
      }

    } else {
      return {
        status: 1,
         message:"fail"
      }
    }
  }



  async siseLogin(ip,username,password) {

   if(username.length==4&&!isNaN(username)){

    const teacherSalt = await this.app.mysql.get('teacher', {
      code:username,
    });
    if(!teacherSalt){

     return{
            status:1,
            message:"err"
        }

     }
   const oldTeacherSalt = teacherSalt?teacherSalt.salt:''
    const teacher = await this.app.mysql.get('teacher', {
      code:username,
      password:shal(shal(password)+psStr+oldTeacherSalt)
    });

   if(teacher){
        return{
         status:1,
         token:teacher.u_id,
         role:teacher.role,
         message:"haveLogin"
        }
    }else{
     return{
            status:1,
            message:"err"
        }
    }
    } 
    
   const userSalt = await this.app.mysql.get('system_user', {
      stu_number:username,
    });
     
   const oldSalt = userSalt?userSalt.salt:''
   const user = await this.app.mysql.get('system_user', {
      stu_number:username,
       password:shal(shal(password)+psStr+oldSalt)
    });

     if(user){
        return{
         status:1,
         token:user.u_id,
         role:'student',
         message:"haveLogin"
        }
    }

   
    const sessionID = shal(shal(session+parseInt(Math.random()*999999)))
    const url = "http://class.sise.com.cn:7001/sise/"
    const uidUrl = "http://class.sise.com.cn:7001/sise/login_check_login.jsp"
    var schedularUrl = "http://class.sise.com.cn:7001/sise/module/student_schedular/student_schedular.jsp";

     var loginForm = await this.app.curl(url, {
      dataType: "text"
    })

    var preg_first_name = /<input type="hidden" name=\"(.*?)\"  value=\"(.*?)\">/
    var ipmd5Data = preg_first_name.exec(loginForm.data);
    var newipmd5 = ipmd5Data[0]
    var ipmd5 = newipmd5.substr(newipmd5.indexOf("name=") + 6, 32)
    var  ipsisemd5= newipmd5.substr(newipmd5.indexOf("value=") + 7, 32)
   
    var preg_name = /<input id=\"random\"   type=\"hidden\"  value=\"(.*?)\"  name=\"random\" \/>/
    var res = preg_name.exec(loginForm.data);
    var dataInput = res[0]
    
    var random = dataInput.substr(dataInput.indexOf("value=") + 7, 13)
    var secreString = sessionID + random
   
    var value =crypto.createHash('md5').update(secreString, 'utf8').digest('hex');
        value = value.toUpperCase()
    var valueLen = value.length
    var randomlen = random.length
    var token = '';
    for (let index = 0; index < valueLen; index++) {
      token += value[index];
      if (index < randomlen) {
        token += random[index];
      }
    }


    // var postData = `${ipmd5}=${ipsisemd5}&random=${random}&token=${token}&username=${username}&password=${password}`

    // var postData = `${ipmd5}=${ipsisemd5}&username=${username}&password=${password}`
   var postData = {
       username,
       password
     }
     postData[ipmd5] = ipsisemd5

    
    let result = await this.app.curl(uidUrl, {
      method: "POST",
      data: postData,
      dataType:"text"
    });
    if(result.data.indexOf("<script>top.location.href='/sise/index.jsp'</script>")==-1){
       
        return{
            status:0,
            message:"err"
        }

      
    }

 
  var resCookie = result.headers["set-cookie"]

    let results = await this.app.curl(schedularUrl, {
     headers:{
      
        Cookie:resCookie
    }
    });
  var content =  Iconv.decode(results.data, 'gb2312').toString()
  
      var $ =  cheerio.load(content,{
              xml:{normalizeWhitespace:true}
             });  
    
     var userInfo = $('.style16').text()
     var classInfo =  $('.font12').text()
       
         userInfo = userInfo.split(" &nbsp;")
  
     var name = userInfo[1].replace("姓名: ","") 

     var classs = userInfo[2].replace("年级: ","") 

     var major = userInfo[3].replace("专业: ","")

     classInfo = classInfo.substr(classInfo.indexOf('星期日')+3)
     var mindex = major.indexOf(" ")

      major =  major.substr(0,mindex)
  
     
    
   var avatar = "https://media.kaolaplay.com/1508291035500.png"
   var salt = shal(new Date().getTime()+parseInt(Math.random()*999999))
    password = shal(shal(password)+psStr+salt)
   var u_id =  shal(shal(username)+psStr+password+salt)
   const newUser = await this.app.mysql.insert('system_user', {
      stu_number:username,
      class:classs,
      major,
      salt,
      role:'student',
      username:name,
      password,
      u_id,
      avatar,
      content:classInfo
    });
    return {
          role:'student',
          token:u_id,
         status:1,
         message:"ok"
     }


  }


async logout(token) {

    
  
   
    return {
        status: 1,
        message:'ok'
      }
    
  }

}

module.exports = UserService;
