const Controller = require('egg').Controller;
class teacherController extends Controller {


  async getTeacherList(ctx) {
    const {page,size,token} = ctx.request.body;
    const data = await ctx.service.teacher.getTeacherList(token,page,size);
    ctx.body = data;
  }

  async getMenber(ctx) {
    const name = ctx.request.body.name;
    const data = await ctx.service.teacher.getMenber(name);
    ctx.body = data;
  }

 async addNewTeacher(ctx) {
    const teacher = ctx.request.body.teacher;
    const data = await ctx.service.teacher.addNewTeacher(teacher);
    ctx.body = data;
  }

 async updateTeacherInfo(ctx) {
    const form = ctx.request.body.form;
    const data = await ctx.service.teacher.updateTeacherInfo(form);
    ctx.body = data;
  }


async deleteTeacherInfo(ctx) {
    const u_id = ctx.request.body.u_id;
    const data = await ctx.service.teacher.deleteTeacherInfo(u_id);
    ctx.body = data;
  }


 async updatePs(ctx) {
    const {code,password,newps} = ctx.request.body;
    const data = await ctx.service.teacher.updatePs(code,password,newps);
    ctx.body = data;
  }


async deleteMission(ctx) {
    const {id} = ctx.request.body;
    const data = await ctx.service.teacher.deleteMission(id);
    ctx.body = data;
  }



 async updateTime(ctx) {
    const { time, beginDate,endDate,type, post_time} = ctx.request.body;
    const data = await ctx.service.teacher.updateTime( time,beginDate,endDate,type, post_time);
    ctx.body = data;
  }

async confirmMission(ctx) {
    const {id,uid,pass} = ctx.request.body;
    const data = await ctx.service.teacher.confirmMission(id,uid,pass);
    ctx.body = data;
  }





async updateTeacherStudent(ctx) {
    const {id,uid,menber_id,tid,teacher_name} = ctx.request.body;
    const data = await ctx.service.teacher.updateTeacherStudent(id,uid,menber_id,tid,teacher_name);
    ctx.body = data;
  }


async updateCourseStatus(ctx) {
    const { cid, status} = ctx.request.body;
    const data = await ctx.service.teacher.updateCourseStatus(cid,status);
    ctx.body = data;
  }

async getSetTime(ctx) {
    const { time} = ctx.request.body;
    const data = await ctx.service.teacher.getSetTime(time);
    ctx.body = data;
  }


async haveTeacherStudent(ctx) {
    const { id, page, size} = ctx.request.body;
    const data = await ctx.service.teacher.haveTeacherStudent(id, page, size);
    ctx.body = data;
  }



  async haveChoiceStudent(ctx) {
     const {tid} = ctx.request.body;
    const data = await ctx.service.teacher.haveChoiceStudent(tid);
    ctx.body = data;
  }

 async getStudentCourse(ctx) {
     const {uid} = ctx.request.body;
    const data = await ctx.service.teacher.getStudentCourse(uid);
    ctx.body = data;
  }


async getAllTeacher(ctx) {
     const {page,size} = ctx.request.body;
    const data = await ctx.service.teacher.getAllTeacher(page,size);
    ctx.body = data;
  }


async addNewMission(ctx) {
     const {title, description,upload,download, token, file,time,deadline,name} = ctx.request.body;
    const data = await ctx.service.teacher.addNewMission(title, description,upload,download, token, file,time,deadline,name);
    ctx.body = data;
  }


 async addMyGraduation(ctx) {
     const {tid, classType, majorType, title, description, time} = ctx.request.body;
    const data = await ctx.service.teacher.addMyGraduation(tid, classType, majorType, title, description, time);
    ctx.body = data;
  }


  async getStudentList(ctx) {
     const { tid, year} = ctx.request.body;
    const data = await ctx.service.teacher.getStudentList( tid,year);
    ctx.body = data;
  }


  async getTeacherMission(ctx) {
     const { token, page, size} = ctx.request.body;
    const data = await ctx.service.teacher.getTeacherMission(token, page, size);
    ctx.body = data;
  }

 async updatePapper(ctx) {
     const { papper_id,content,status, time} = ctx.request.body;
    const data = await ctx.service.teacher.updatePapper( papper_id,content,status, time);
    ctx.body = data;
  }

 async confirmStudentCourse(ctx) {
     const { id, uid} = ctx.request.body;
    const data = await ctx.service.teacher.confirmStudentCourse(id,uid);
    ctx.body = data;
  }

  async updateScore(ctx) {
     const { uid, type, week, score} = ctx.request.body;
    const data = await ctx.service.teacher.updateScore(uid, type, week, score);
    ctx.body = data;
  }

 async getMyGraduationList(ctx) {
     const { u_id, page, size} = ctx.request.body;
    const data = await ctx.service.teacher.getMyGraduationList(u_id, page, size);
    ctx.body = data;
  }


  async choiceTeacher(ctx) {
    const {token, tid, menber_id,year, phone, qq, workType, menber_phone, menber_qq, menber_woker,menber_ps,team, file} = ctx.request.body;
    const data = await ctx.service.teacher.choiceTeacher(token, tid, menber_id,year, phone, qq, workType, menber_phone, menber_qq, menber_woker,menber_ps,team, file);
    ctx.body = data;
  }


}

module.exports = teacherController;
