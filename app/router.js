'use strict';



 // middlewares.admin({handle:""}) 权限控制中间件，通过添加不同的handle进行控制

module.exports = app => {
  

 const { router, controller,middlewares,io } = app;


//文件上传中间件
 const uploadFile =middlewares.upload()


/*---------------------------分界线------------------------*/
//测试
router.post('/postest', controller.postest.listPosts);

//实验上传
const uploadExperFile = middlewares.uploadExper();
router.post('/upload/teacher/exper',uploadExperFile,controller.uploadExper.uploadFile);

//题库
router.post('/add/exper/question',controller.experQuestions.addQuestion);
router.post('/read/exper/question',controller.experQuestions.readQuestion);
router.post('/update/exper/question',controller.experQuestions.updateQuestion);
router.post('/delete/exper/question',controller.experQuestions.deleteQuestion);
router.post('/search/exper/question',controller.experQuestions.searchQuestion);
router.post('/get/exper/qusetion/Category',controller.experQuestions.getCategoryList);
router.post('/get/exper/qusetion/modifyrecord',controller.experQuestions.getmodifyList);

io.of('/online').route('JoinRoom', io.controller.nsp.JoinRoom);
io.of('/online').route('LeaveRoom', io.controller.nsp.LeaveRoom);
io.of('/online').route('LookRoom', io.controller.nsp.lookroom);
io.of('/online').route('heartmove', io.controller.nsp.heartmove);
io.of('/online').route('closeSocket', io.controller.nsp.closesocket);
io.of('/online').route('senData', io.controller.nsp.senData);
    
//教师首页
router.post('/get/teacher/index',controller.experList.teachindex);
//学生首页
router.post('/get/student/index',controller.experList.stuindex);
// 获取教师实验列表
router.post('/getlist/teacher/exper',controller.experList.Geteachlist);
//获取详细问题
router.post('/read/teacher/questions',controller.experList.read_question);
//获取学生实验列表
router.post('/getstulist/teacher/exper',controller.experList.Getstulist);
//搜索学生实验
router.post('/search/teacher/stuexper',controller.experList.SearchStuexper);
//搜索实验实验指导书
router.post('/search/teacher/exper',controller.experList.TeachSearchexper);

//学生端

//获取实验列表
router.post('/getlist/student/exper',controller.experList.Stugetexperlist);
//搜索学生实验
router.post('/search/student/exper',controller.experList.StuSearchexper);

/*-------教师端-------*/

/*在线作业*/

//新建在线作业--大题目
router.post('/add/teacher/inexper',controller.onlineExperTeacher.addexper);
//新建在线作业问题
router.post('/add/teacher/question',controller.onlineExperTeacher.addquestion);
//查看在线作业以及问题
router.post('/read/teacher/inexper',controller.onlineExperTeacher.readexper);
//更新在线作业
router.post('/update/teacher/inexper',controller.onlineExperTeacher.updatexper);
//更新在线作业--问题
router.post('/update/teacher/question',controller.onlineExperTeacher.update_question);
//删除在线作业
router.post('/delete/teacher/inexper',controller.onlineExperTeacher.deletexper);
//删除在线作业--问题
router.post('/delete/teacher/question',controller.onlineExperTeacher.delete_question);
//获取学生作业列表,用于改作业
router.post('/getstulist/teacher/inexper', controller.onlineExperTeacher.readStuExper);
//作业评分
router.post('/download/teacher/stuexperStream', controller.experfile.BatchDownloadStream);
router.post('/download/teacher/stuexper', controller.experfile.BatchDownload);
router.post('/delete/teacher/zip', controller.experfile.delfile);
router.post('/registerScore/teacher/inexper', controller.onlineExperTeacher.registerScore);
//问题操作，增删改
router.post('/operation/teacher/question', controller.onlineExperTeacher.quest_operation);

/*课时作业*/

//重新上传实验
router.post('/reupload/teacher/exper',controller.experfile.reupload);
//新建课时作业
router.post('/add/teacher/outexper', controller.offlineExperTeacher.addexper);
//查看课时作业
router.post('/read/teacher/outexper', controller.offlineExperTeacher.readexper);
//更新课时作业
router.post('/update/teacher/outexper', controller.offlineExperTeacher.updatexper);
//删除课时作业
router.post('/delete/teacher/outexper', controller.offlineExperTeacher.delexper);
//获取学生作业列表,评分
router.post('/getstulist/teacher/outexper', controller.offlineExperTeacher.readStuExper);
//作业评分
router.post('/registerScore/teacher/outexper', controller.offlineExperTeacher.registerScore);

/*-------学生端-------*/

/*在线作业*/

//查看在线作业
router.post('/read/student/inexper', controller.onlineExperStudent.readexper);
//查看作业详细问题
router.post('/read/student/question', controller.onlineExperStudent.readquestion);
//提交在线作业
router.post('/submit/student/inexper', controller.onlineExperStudent.subexper);
//查看评分后的作业详细问题
router.post('/read/student/scored_question', controller.onlineExperStudent.read_scored_exper);

/*课时作业*/

//查看课时作业
router.post('/read/student/outexper', controller.offlineExperStudent.readexper);
//提交课时作业
router.post('/submit/student/outexper', controller.offlineExperStudent.subexper);
//重新提交作业
router.post('/resubmit/student/exper',controller.experfile.resubexper);

/*-------------------------课程平台------------------------*/


// 创建课程
    router.post('/add/course', middlewares.checkLogin(), controller.course.addCourse);

    // 课程列表
    router.get('/get/course/list', middlewares.checkLogin(), controller.course.getCourseList);

    // 删除课程
    router.post('/delete/course', middlewares.checkLogin(), controller.course.deleteCourse);

    // 课程详情
    router.get('/get/course/detail', middlewares.checkLogin(), controller.course.getCourseDetail);

    // 查看学生名单列表
    router.get('/get/student/list', middlewares.checkLogin(), controller.course.getStudentList);

    // 上传课程介绍讲义
    router.post('/upload/course/desc', middlewares.checkLogin(), controller.course.uploadCourseDesc);

    // 新建课时
    router.post('/create/course/time', middlewares.checkLogin(), controller.courseTime.createCourseTime);

    // 删除课时
    router.post('/delete/course/time', middlewares.checkLogin(), controller.courseTime.deleteCourseTime);

    // 课时列表
    router.get('/get/course/time/list', middlewares.checkLogin(), controller.courseTime.getCourseTimeList);

    // 课时信息
    router.get('/get/course/time/detail', middlewares.checkLogin(), controller.courseTime.getCourseTimeDetail);

    // 上传课时介绍讲义
    router.post('/uplad/course/time/desc', middlewares.checkLogin(), controller.courseTime.uploadCourseTimeDesc);

    // 修改课时文字介绍
    router.post('/change/course/time/desc/text', middlewares.checkLogin(), controller.courseTime.changeCourseTimeDescText);

    // 上传附件
    router.post('/upload/course/time/file', middlewares.checkLogin(), controller.courseTime.uploadCourseTimeFile);

    // 删除附件
    router.post('/delete/course/time/file', middlewares.checkLogin(), controller.courseTime.deleteCourseTimeFile);

    // 附件列表
    router.get('/get/course/time/file/list', middlewares.checkLogin(), controller.courseTime.getCourseTimeFileList);

    // 学生课程列表
    router.post('/get/student/course/list', middlewares.checkLogin(), controller.course.getStudentCourseList);

    // 课程问题提问
    router.post('/add/course/question', middlewares.checkLogin(), controller.courseQuestion.addCourseQuestion);

    // 课程问题回答
    router.post('/add/course/question/reply', middlewares.checkLogin(), controller.courseQuestion.addCourseQuestionReply);

    // 课程问题回答评论
    router.post('/add/course/question/reply/comment', middlewares.checkLogin(), controller.courseQuestion.addCourseQuestionReplyComment);

    // 当前课程答疑列表
    router.get('/get/current/course/question/list', middlewares.checkLogin(), controller.courseQuestion.getCurrentCourseQuestionList);

// 当前课程未审核答疑列表
    router.get('/get/current/course/question/list/no/audit', middlewares.checkLogin(), controller.courseQuestion.getCurrentCourseQuestionListNoAudit);

    // 答疑列表
    router.get('/get/course/question/list', middlewares.checkLogin(), controller.courseQuestion.getCourseQuestionList);

    // 删除答疑
    router.post('/delete/course/question', middlewares.checkLogin(), controller.courseQuestion.deleteCourseQuestion);

    // 删除回答
    router.post('/delete/course/question/reply', middlewares.checkLogin(), controller.courseQuestion.deleteCourseQuestionReply);

    // 删除评论
    router.post('/delete/course/question/comment', middlewares.checkLogin(), controller.courseQuestion.deleteCourseQuestionComment);

    // 答疑详情
    router.get('/get/course/question/detail', middlewares.checkLogin(), controller.courseQuestion.getCourseQuestionDetail);

    // 设置答疑状态
    router.post('/change/course/question/status', middlewares.checkLogin(), controller.courseQuestion.changeCourseQuestionStatus);

    // 设置回答状态
    router.post('/change/course/question/reply/status', middlewares.checkLogin(), controller.courseQuestion.changeCourseQuestionReplyStatus);

    // 新增笔记
    router.post('/add/course/note', middlewares.checkLogin(), controller.courseNote.addCourseNote);

    // 删除笔记
    router.post('/delete/course/note', middlewares.checkLogin(), controller.courseNote.deleteCourseNote);

    // 笔记列表
    router.get('/get/course/note/list', middlewares.checkLogin(), controller.courseNote.getCourseNoteList);

// 获取回答过的答疑列表
    router.get('/get/has/replied/question/list', middlewares.checkLogin(), controller.courseQuestion.getHasRepliedQuestionList);

    // 获取评论过的答疑列表
    router.get('/get/has/commented/question/list', middlewares.checkLogin(), controller.courseQuestion.getHasCommentedQuestionList);

    //获取自己提问答疑
    router.get('/get/my/course/question/list', middlewares.checkLogin(), controller.courseQuestion.getMyCourseQuestionList);

// 答疑审核
    router.post('/audit/course/question', middlewares.checkLogin(), controller.courseQuestion.auditCourseQuestion);

// 上传图片公共模块
    router.post('/upload/image/of/public', middlewares.checkLogin(), controller.courseNote.uploadImageOfPublic);

// 重新提交审核失败的答疑
    router.post('/update/audit/fail/course/question', middlewares.checkLogin(), controller.courseQuestion.updateAuditFailCourseQuestion);

// 回复通知
    router.get('/get/course/question/notify', middlewares.checkLogin(), controller.courseQuestion.getCourseQuestionNotify);

    // 是否有新的回复通知
    router.get('/has/new/course/question/notify', middlewares.checkLogin(), controller.courseQuestion.hasNewCourseQuestionNotify);

// 设置通知状态
    router.post('/set/course/question/notify', middlewares.checkLogin(), controller.courseQuestion.setCourseQuestionNotify);




/*--------------------毕业设计管理系统---------------------*/


//用户登录
   router.post("/sise/login", controller.user.siseLogin)

//刷新课程表
 router.post("/refresh/course",middlewares.admin({handle:"refreshCourse"}),controller.user.refreshCourse)

//获取用户信息
 router.post("/user/info",controller.user.info)

//获取用户聊天信息
  router.get("/get/chat/user/info",controller.user.chatinfo)

//用户退出登录
 router.get("/user/logout",controller.user.logout)

//获取用户评论
 router.post("/get/seller/comment", controller.comment.getComment);

//用户回复
 router.post("/seller/reply", controller.comment.reply);

//获取用户回复
 router.get("/get/seller/reply", controller.comment.getReply);

//解锁页面
 router.post("/view/unlock", controller.user.unlock);


//获取电影列表
 router.get("/get/movie", controller.movie.getMovie);
 


//获取毕设点赞数
 router.post("/add/movie/praise", controller.movie.addMoviePraise);

//添加优秀毕设评论
 router.post("/add/movie/comment", controller.movie.addMovieComment);

//获取优秀毕设评论
router.get("/get/movie/comment", controller.movie.getMovieComment);

//获取教师列表
 router.post("/get/teacher/list",middlewares.admin({handle:"getTeacherList"}), controller.teacher.getTeacherList);

//获取已经选择该老师的所有学生
 router.post('/have/choice/student',middlewares.admin({handle:"haveChoiceStudent"}), controller.teacher.haveChoiceStudent);

//查找学生
 router.post("/get/menber",middlewares.admin({handle:"getMenber"}), controller.teacher.getMenber);

//选择导师
 router.post('/choice/teacher',middlewares.admin({handle:"choiceTeacher"}), controller.teacher.choiceTeacher);

//获取团队成员列表
 router.get('/get/team/list',middlewares.admin({handle:"getTeamList"}), controller.user.getTeamList);

//上传作品
router.post('/upload/work',uploadFile ,controller.upload.uploadWork);

//更新作品
router.get('/update/work',middlewares.admin({handle:"updateWork"}), controller.user.updateWork);


//添加周报
  router.get('/add/week/report',middlewares.admin({handle:"addWeekReport"}), controller.user.addWeekReport);

//获取周报
  router.get('/get/week/report',middlewares.admin({handle:"getWeekReport"}), controller.user.getWeekReport);

//获取内容详情
   router.get('/get/content/detail',middlewares.admin({handle:"getContentDetail"}), controller.user.getContentDetail);

//消息页面

//获取消息列表
router.post('/get/message',middlewares.admin({handle:"getMessage"}),controller.message.getMessage);

//获取未读消息
router.post('/get/new/message',middlewares.admin({handle:"getNewMessage"}),controller.message.getNewMessage);

//获取毕设课题列表
router.post('/get/graduation/work',middlewares.admin({handle:"getGraduationWork"}),controller.graduation.getGraduationWork);

//提交选择毕设课题意向
router.post('/choice/graduation/work',middlewares.admin({handle:"choiceGraduationWork"}),controller.graduation.choiceGraduationWork);

//添加毕设课题
router.post('/add/graduation/work',middlewares.admin({handle:"addGraduationWork"}),controller.graduation.addGraduationWork);

//获取毕设开始时间
router.post('/get/mission/start',middlewares.admin({handle:"getMissionStart"}),controller.graduation.getMissionStart);

//提交任务周报
router.post('/submit/week/report',middlewares.admin({handle:"submitWeekReport"}),controller.graduation.submitWeekReport);

//获取任务周报
router.post('/get/old/report',middlewares.admin({handle:"getWeekReport"}),controller.graduation.getWeekReport);

//获取任务列表
router.post('/get/my/mission',middlewares.admin({handle:"getMyMission"}),controller.graduation.getMyMission);

//完成任务
router.post('/complete/my/mission',middlewares.admin({handle:"completeMission"}),controller.graduation.completeMission);

//上传毕业论文
router.post('/submit/my/papper',middlewares.admin({handle:"submitMyPapper"}),controller.graduation.submitMyPapper);


//获取已上传毕业论文
router.post('/get/my/papper',middlewares.admin({handle:"getMyPapper"}),controller.graduation.getMyPapper);

//获取毕设选择学生列表
router.post('/get/student/list',middlewares.admin({handle:"getStudentList"}),controller.teacher.getStudentList);

//更新周报成绩
router.post('/update/report/score',middlewares.admin({handle:"updateScore"}),controller.teacher.updateScore);


//获取学生选择的课题
router.post('/get/student/course',middlewares.admin({handle:"getStudentCourse"}),controller.teacher.getStudentCourse);

//确认学生选择的课题
router.post('/confirm/student/course',middlewares.admin({handle:"confirmStudentCourse"}),controller.teacher.confirmStudentCourse);

//修改学生论文
router.post('/update/student/papper',middlewares.admin({handle:"updatePapper"}),controller.teacher.updatePapper);

//获取我的毕业论文
router.post('/get/my/graduation',middlewares.admin({handle:"getMyGraduationList"}),controller.teacher.getMyGraduationList);

//添加我的毕业论文选题
router.post('/add/my/graduation',middlewares.admin({handle:"addMyGraduation"}),controller.teacher.addMyGraduation);

//获取教师任务
router.post('/get/teacher/mission',middlewares.admin({handle:"getTeacherMission"}),controller.teacher.getTeacherMission);

//添加新任务
router.post('/add/new/mission',middlewares.admin({handle:"addNewMission"}),controller.teacher.addNewMission);

//确认学生任务
router.post('/confirm/teacher/mission',middlewares.admin({handle:"confirmMission"}),controller.teacher.confirmMission);

//更新个人信息

router.post('/update/user/info',middlewares.admin({handle:"updateInfo"}),controller.user.updateInfo);

//获取教师列表

router.post('/get/all/teacher',middlewares.admin({handle:"getAllTeacher"}),controller.teacher.getAllTeacher);

//更新选题详情

router.post('/update/course/status',middlewares.admin({handle:"updateCourseStatus"}),controller.teacher.updateCourseStatus);

//获取教师学生列表

router.post('/get/teacher/student',middlewares.admin({handle:"haveTeacherStudent"}),controller.teacher.haveTeacherStudent);


//获取教师学生列表

router.post('/update/teacher/student',middlewares.admin({handle:"updateTeacherStudent"}),controller.teacher.updateTeacherStudent);

//获取时间列表

router.post('/get/time',middlewares.admin({handle:"getSetTime"}),controller.teacher.getSetTime);

//添加新的老师

router.post('/add/new/teacher',middlewares.admin({handle:"addNewTeacher"}),controller.teacher.addNewTeacher);

//删除优秀毕设

router.post('/delete/movie',middlewares.admin({handle:"deleteMovie"}),controller.movie.deleteMovie);

//更新优秀毕设

router.post('/update/movie',middlewares.admin({handle:"updateMovie"}),controller.movie.updateMovie);

//更新时间

router.post('/update/time',middlewares.admin({handle:"updateTime"}),controller.teacher.updateTime);

//添加新的通知

router.post('/add/new/message',middlewares.admin({handle:"addNewNotice"}),controller.message.addNewNotice);

//更新教师密码

router.post('/update/teacher/ps',middlewares.admin({handle:"updatePS"}),controller.teacher.updatePs);

//删除教师任务

router.post('/delete/mission',middlewares.admin({handle:"deleteMission"}),controller.teacher.deleteMission);


//更新教师信息

router.post('/update/teacher/info',middlewares.admin({handle:"updateTeacherInfo"}),controller.teacher.updateTeacherInfo);

//删除教师信息

router.post('/delete/teacher/info',middlewares.admin({handle:"deleteTeacherInfo"}),controller.teacher.deleteTeacherInfo);
 

//获取权限控制角色

router.post('/get/permission/list',middlewares.admin({handle:"getRole"}),controller.permission.getRoles);

//添加权限控制角色

router.post('/add/new/role',middlewares.admin({handle:"addNewRole"}),controller.permission.addNewRole);

//更新权限控制角色

router.post('/update/role',middlewares.admin({handle:"updateRole"}),controller.permission.updateRole);


//删除权限控制角色

router.post('/delete/role',middlewares.admin({handle:"deleteRole"}),controller.permission.deleteRole);

//获取权限控制模块

router.post('/get/modules',middlewares.admin({handle:"getModules"}),controller.permission.getModules);

//更新权限控制模块

router.post('/update/module',middlewares.admin({handle:"updateModule"}),controller.permission.updateModule);

//删除权限控制模块

router.post('/delete/module',middlewares.admin({handle:"deleteModule"}),controller.permission.deleteModule);

//添加权限控制模块

router.post('/add/new/module',middlewares.admin({handle:"addNewModule"}),controller.permission.addNewModule);

//获取权限控制操作

router.post('/get/handle',middlewares.admin({handle:"getHandle"}),controller.permission.getHandle);


//更新权限控制操作

router.post('/update/handle',middlewares.admin({handle:"updateHandle"}),controller.permission.updateHandle);

//添加权限控制操作

router.post('/add/new/handle',middlewares.admin({handle:"addNewHandle"}),controller.permission.addNewHandle);


//删除权限控制操作

router.post('/delete/handle',middlewares.admin({handle:"deleteHandle"}),controller.permission.deleteHandle);

//改变权限控制操作

router.post('/change/handle',middlewares.admin({handle:"changeHandle"}),controller.permission.changeHandle);




    };
