'use strict';



 // middlewares.admin({handle:""}) Ȩ�޿����м����ͨ����Ӳ�ͬ��handle���п���

module.exports = app => {
  

 const { router, controller,middlewares,io } = app;


//�ļ��ϴ��м��
 const uploadFile =middlewares.upload()


/*---------------------------�ֽ���------------------------*/
//����
router.post('/postest', controller.postest.listPosts);

//ʵ���ϴ�
const uploadExperFile = middlewares.uploadExper();
router.post('/upload/teacher/exper',uploadExperFile,controller.uploadExper.uploadFile);

//���
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
    
//��ʦ��ҳ
router.post('/get/teacher/index',controller.experList.teachindex);
//ѧ����ҳ
router.post('/get/student/index',controller.experList.stuindex);
// ��ȡ��ʦʵ���б�
router.post('/getlist/teacher/exper',controller.experList.Geteachlist);
//��ȡ��ϸ����
router.post('/read/teacher/questions',controller.experList.read_question);
//��ȡѧ��ʵ���б�
router.post('/getstulist/teacher/exper',controller.experList.Getstulist);
//����ѧ��ʵ��
router.post('/search/teacher/stuexper',controller.experList.SearchStuexper);
//����ʵ��ʵ��ָ����
router.post('/search/teacher/exper',controller.experList.TeachSearchexper);

//ѧ����

//��ȡʵ���б�
router.post('/getlist/student/exper',controller.experList.Stugetexperlist);
//����ѧ��ʵ��
router.post('/search/student/exper',controller.experList.StuSearchexper);

/*-------��ʦ��-------*/

/*������ҵ*/

//�½�������ҵ--����Ŀ
router.post('/add/teacher/inexper',controller.onlineExperTeacher.addexper);
//�½�������ҵ����
router.post('/add/teacher/question',controller.onlineExperTeacher.addquestion);
//�鿴������ҵ�Լ�����
router.post('/read/teacher/inexper',controller.onlineExperTeacher.readexper);
//����������ҵ
router.post('/update/teacher/inexper',controller.onlineExperTeacher.updatexper);
//����������ҵ--����
router.post('/update/teacher/question',controller.onlineExperTeacher.update_question);
//ɾ��������ҵ
router.post('/delete/teacher/inexper',controller.onlineExperTeacher.deletexper);
//ɾ��������ҵ--����
router.post('/delete/teacher/question',controller.onlineExperTeacher.delete_question);
//��ȡѧ����ҵ�б�,���ڸ���ҵ
router.post('/getstulist/teacher/inexper', controller.onlineExperTeacher.readStuExper);
//��ҵ����
router.post('/download/teacher/stuexperStream', controller.experfile.BatchDownloadStream);
router.post('/download/teacher/stuexper', controller.experfile.BatchDownload);
router.post('/delete/teacher/zip', controller.experfile.delfile);
router.post('/registerScore/teacher/inexper', controller.onlineExperTeacher.registerScore);
//�����������ɾ��
router.post('/operation/teacher/question', controller.onlineExperTeacher.quest_operation);

/*��ʱ��ҵ*/

//�����ϴ�ʵ��
router.post('/reupload/teacher/exper',controller.experfile.reupload);
//�½���ʱ��ҵ
router.post('/add/teacher/outexper', controller.offlineExperTeacher.addexper);
//�鿴��ʱ��ҵ
router.post('/read/teacher/outexper', controller.offlineExperTeacher.readexper);
//���¿�ʱ��ҵ
router.post('/update/teacher/outexper', controller.offlineExperTeacher.updatexper);
//ɾ����ʱ��ҵ
router.post('/delete/teacher/outexper', controller.offlineExperTeacher.delexper);
//��ȡѧ����ҵ�б�,����
router.post('/getstulist/teacher/outexper', controller.offlineExperTeacher.readStuExper);
//��ҵ����
router.post('/registerScore/teacher/outexper', controller.offlineExperTeacher.registerScore);

/*-------ѧ����-------*/

/*������ҵ*/

//�鿴������ҵ
router.post('/read/student/inexper', controller.onlineExperStudent.readexper);
//�鿴��ҵ��ϸ����
router.post('/read/student/question', controller.onlineExperStudent.readquestion);
//�ύ������ҵ
router.post('/submit/student/inexper', controller.onlineExperStudent.subexper);
//�鿴���ֺ����ҵ��ϸ����
router.post('/read/student/scored_question', controller.onlineExperStudent.read_scored_exper);

/*��ʱ��ҵ*/

//�鿴��ʱ��ҵ
router.post('/read/student/outexper', controller.offlineExperStudent.readexper);
//�ύ��ʱ��ҵ
router.post('/submit/student/outexper', controller.offlineExperStudent.subexper);
//�����ύ��ҵ
router.post('/resubmit/student/exper',controller.experfile.resubexper);

/*-------------------------�γ�ƽ̨------------------------*/


// �����γ�
    router.post('/add/course', middlewares.checkLogin(), controller.course.addCourse);

    // �γ��б�
    router.get('/get/course/list', middlewares.checkLogin(), controller.course.getCourseList);

    // ɾ���γ�
    router.post('/delete/course', middlewares.checkLogin(), controller.course.deleteCourse);

    // �γ�����
    router.get('/get/course/detail', middlewares.checkLogin(), controller.course.getCourseDetail);

    // �鿴ѧ�������б�
    router.get('/get/student/list', middlewares.checkLogin(), controller.course.getStudentList);

    // �ϴ��γ̽��ܽ���
    router.post('/upload/course/desc', middlewares.checkLogin(), controller.course.uploadCourseDesc);

    // �½���ʱ
    router.post('/create/course/time', middlewares.checkLogin(), controller.courseTime.createCourseTime);

    // ɾ����ʱ
    router.post('/delete/course/time', middlewares.checkLogin(), controller.courseTime.deleteCourseTime);

    // ��ʱ�б�
    router.get('/get/course/time/list', middlewares.checkLogin(), controller.courseTime.getCourseTimeList);

    // ��ʱ��Ϣ
    router.get('/get/course/time/detail', middlewares.checkLogin(), controller.courseTime.getCourseTimeDetail);

    // �ϴ���ʱ���ܽ���
    router.post('/uplad/course/time/desc', middlewares.checkLogin(), controller.courseTime.uploadCourseTimeDesc);

    // �޸Ŀ�ʱ���ֽ���
    router.post('/change/course/time/desc/text', middlewares.checkLogin(), controller.courseTime.changeCourseTimeDescText);

    // �ϴ�����
    router.post('/upload/course/time/file', middlewares.checkLogin(), controller.courseTime.uploadCourseTimeFile);

    // ɾ������
    router.post('/delete/course/time/file', middlewares.checkLogin(), controller.courseTime.deleteCourseTimeFile);

    // �����б�
    router.get('/get/course/time/file/list', middlewares.checkLogin(), controller.courseTime.getCourseTimeFileList);

    // ѧ���γ��б�
    router.post('/get/student/course/list', middlewares.checkLogin(), controller.course.getStudentCourseList);

    // �γ���������
    router.post('/add/course/question', middlewares.checkLogin(), controller.courseQuestion.addCourseQuestion);

    // �γ�����ش�
    router.post('/add/course/question/reply', middlewares.checkLogin(), controller.courseQuestion.addCourseQuestionReply);

    // �γ�����ش�����
    router.post('/add/course/question/reply/comment', middlewares.checkLogin(), controller.courseQuestion.addCourseQuestionReplyComment);

    // ��ǰ�γ̴����б�
    router.get('/get/current/course/question/list', middlewares.checkLogin(), controller.courseQuestion.getCurrentCourseQuestionList);

// ��ǰ�γ�δ��˴����б�
    router.get('/get/current/course/question/list/no/audit', middlewares.checkLogin(), controller.courseQuestion.getCurrentCourseQuestionListNoAudit);

    // �����б�
    router.get('/get/course/question/list', middlewares.checkLogin(), controller.courseQuestion.getCourseQuestionList);

    // ɾ������
    router.post('/delete/course/question', middlewares.checkLogin(), controller.courseQuestion.deleteCourseQuestion);

    // ɾ���ش�
    router.post('/delete/course/question/reply', middlewares.checkLogin(), controller.courseQuestion.deleteCourseQuestionReply);

    // ɾ������
    router.post('/delete/course/question/comment', middlewares.checkLogin(), controller.courseQuestion.deleteCourseQuestionComment);

    // ��������
    router.get('/get/course/question/detail', middlewares.checkLogin(), controller.courseQuestion.getCourseQuestionDetail);

    // ���ô���״̬
    router.post('/change/course/question/status', middlewares.checkLogin(), controller.courseQuestion.changeCourseQuestionStatus);

    // ���ûش�״̬
    router.post('/change/course/question/reply/status', middlewares.checkLogin(), controller.courseQuestion.changeCourseQuestionReplyStatus);

    // �����ʼ�
    router.post('/add/course/note', middlewares.checkLogin(), controller.courseNote.addCourseNote);

    // ɾ���ʼ�
    router.post('/delete/course/note', middlewares.checkLogin(), controller.courseNote.deleteCourseNote);

    // �ʼ��б�
    router.get('/get/course/note/list', middlewares.checkLogin(), controller.courseNote.getCourseNoteList);

// ��ȡ�ش���Ĵ����б�
    router.get('/get/has/replied/question/list', middlewares.checkLogin(), controller.courseQuestion.getHasRepliedQuestionList);

    // ��ȡ���۹��Ĵ����б�
    router.get('/get/has/commented/question/list', middlewares.checkLogin(), controller.courseQuestion.getHasCommentedQuestionList);

    //��ȡ�Լ����ʴ���
    router.get('/get/my/course/question/list', middlewares.checkLogin(), controller.courseQuestion.getMyCourseQuestionList);

// �������
    router.post('/audit/course/question', middlewares.checkLogin(), controller.courseQuestion.auditCourseQuestion);

// �ϴ�ͼƬ����ģ��
    router.post('/upload/image/of/public', middlewares.checkLogin(), controller.courseNote.uploadImageOfPublic);

// �����ύ���ʧ�ܵĴ���
    router.post('/update/audit/fail/course/question', middlewares.checkLogin(), controller.courseQuestion.updateAuditFailCourseQuestion);

// �ظ�֪ͨ
    router.get('/get/course/question/notify', middlewares.checkLogin(), controller.courseQuestion.getCourseQuestionNotify);

    // �Ƿ����µĻظ�֪ͨ
    router.get('/has/new/course/question/notify', middlewares.checkLogin(), controller.courseQuestion.hasNewCourseQuestionNotify);

// ����֪ͨ״̬
    router.post('/set/course/question/notify', middlewares.checkLogin(), controller.courseQuestion.setCourseQuestionNotify);




/*--------------------��ҵ��ƹ���ϵͳ---------------------*/


//�û���¼
   router.post("/sise/login", controller.user.siseLogin)

//ˢ�¿γ̱�
 router.post("/refresh/course",middlewares.admin({handle:"refreshCourse"}),controller.user.refreshCourse)

//��ȡ�û���Ϣ
 router.post("/user/info",controller.user.info)

//��ȡ�û�������Ϣ
  router.get("/get/chat/user/info",controller.user.chatinfo)

//�û��˳���¼
 router.get("/user/logout",controller.user.logout)

//��ȡ�û�����
 router.post("/get/seller/comment", controller.comment.getComment);

//�û��ظ�
 router.post("/seller/reply", controller.comment.reply);

//��ȡ�û��ظ�
 router.get("/get/seller/reply", controller.comment.getReply);

//����ҳ��
 router.post("/view/unlock", controller.user.unlock);


//��ȡ��Ӱ�б�
 router.get("/get/movie", controller.movie.getMovie);
 


//��ȡ���������
 router.post("/add/movie/praise", controller.movie.addMoviePraise);

//��������������
 router.post("/add/movie/comment", controller.movie.addMovieComment);

//��ȡ�����������
router.get("/get/movie/comment", controller.movie.getMovieComment);

//��ȡ��ʦ�б�
 router.post("/get/teacher/list",middlewares.admin({handle:"getTeacherList"}), controller.teacher.getTeacherList);

//��ȡ�Ѿ�ѡ�����ʦ������ѧ��
 router.post('/have/choice/student',middlewares.admin({handle:"haveChoiceStudent"}), controller.teacher.haveChoiceStudent);

//����ѧ��
 router.post("/get/menber",middlewares.admin({handle:"getMenber"}), controller.teacher.getMenber);

//ѡ��ʦ
 router.post('/choice/teacher',middlewares.admin({handle:"choiceTeacher"}), controller.teacher.choiceTeacher);

//��ȡ�Ŷӳ�Ա�б�
 router.get('/get/team/list',middlewares.admin({handle:"getTeamList"}), controller.user.getTeamList);

//�ϴ���Ʒ
router.post('/upload/work',uploadFile ,controller.upload.uploadWork);

//������Ʒ
router.get('/update/work',middlewares.admin({handle:"updateWork"}), controller.user.updateWork);


//����ܱ�
  router.get('/add/week/report',middlewares.admin({handle:"addWeekReport"}), controller.user.addWeekReport);

//��ȡ�ܱ�
  router.get('/get/week/report',middlewares.admin({handle:"getWeekReport"}), controller.user.getWeekReport);

//��ȡ��������
   router.get('/get/content/detail',middlewares.admin({handle:"getContentDetail"}), controller.user.getContentDetail);

//��Ϣҳ��

//��ȡ��Ϣ�б�
router.post('/get/message',middlewares.admin({handle:"getMessage"}),controller.message.getMessage);

//��ȡδ����Ϣ
router.post('/get/new/message',middlewares.admin({handle:"getNewMessage"}),controller.message.getNewMessage);

//��ȡ��������б�
router.post('/get/graduation/work',middlewares.admin({handle:"getGraduationWork"}),controller.graduation.getGraduationWork);

//�ύѡ������������
router.post('/choice/graduation/work',middlewares.admin({handle:"choiceGraduationWork"}),controller.graduation.choiceGraduationWork);

//��ӱ������
router.post('/add/graduation/work',middlewares.admin({handle:"addGraduationWork"}),controller.graduation.addGraduationWork);

//��ȡ���迪ʼʱ��
router.post('/get/mission/start',middlewares.admin({handle:"getMissionStart"}),controller.graduation.getMissionStart);

//�ύ�����ܱ�
router.post('/submit/week/report',middlewares.admin({handle:"submitWeekReport"}),controller.graduation.submitWeekReport);

//��ȡ�����ܱ�
router.post('/get/old/report',middlewares.admin({handle:"getWeekReport"}),controller.graduation.getWeekReport);

//��ȡ�����б�
router.post('/get/my/mission',middlewares.admin({handle:"getMyMission"}),controller.graduation.getMyMission);

//�������
router.post('/complete/my/mission',middlewares.admin({handle:"completeMission"}),controller.graduation.completeMission);

//�ϴ���ҵ����
router.post('/submit/my/papper',middlewares.admin({handle:"submitMyPapper"}),controller.graduation.submitMyPapper);


//��ȡ���ϴ���ҵ����
router.post('/get/my/papper',middlewares.admin({handle:"getMyPapper"}),controller.graduation.getMyPapper);

//��ȡ����ѡ��ѧ���б�
router.post('/get/student/list',middlewares.admin({handle:"getStudentList"}),controller.teacher.getStudentList);

//�����ܱ��ɼ�
router.post('/update/report/score',middlewares.admin({handle:"updateScore"}),controller.teacher.updateScore);


//��ȡѧ��ѡ��Ŀ���
router.post('/get/student/course',middlewares.admin({handle:"getStudentCourse"}),controller.teacher.getStudentCourse);

//ȷ��ѧ��ѡ��Ŀ���
router.post('/confirm/student/course',middlewares.admin({handle:"confirmStudentCourse"}),controller.teacher.confirmStudentCourse);

//�޸�ѧ������
router.post('/update/student/papper',middlewares.admin({handle:"updatePapper"}),controller.teacher.updatePapper);

//��ȡ�ҵı�ҵ����
router.post('/get/my/graduation',middlewares.admin({handle:"getMyGraduationList"}),controller.teacher.getMyGraduationList);

//����ҵı�ҵ����ѡ��
router.post('/add/my/graduation',middlewares.admin({handle:"addMyGraduation"}),controller.teacher.addMyGraduation);

//��ȡ��ʦ����
router.post('/get/teacher/mission',middlewares.admin({handle:"getTeacherMission"}),controller.teacher.getTeacherMission);

//���������
router.post('/add/new/mission',middlewares.admin({handle:"addNewMission"}),controller.teacher.addNewMission);

//ȷ��ѧ������
router.post('/confirm/teacher/mission',middlewares.admin({handle:"confirmMission"}),controller.teacher.confirmMission);

//���¸�����Ϣ

router.post('/update/user/info',middlewares.admin({handle:"updateInfo"}),controller.user.updateInfo);

//��ȡ��ʦ�б�

router.post('/get/all/teacher',middlewares.admin({handle:"getAllTeacher"}),controller.teacher.getAllTeacher);

//����ѡ������

router.post('/update/course/status',middlewares.admin({handle:"updateCourseStatus"}),controller.teacher.updateCourseStatus);

//��ȡ��ʦѧ���б�

router.post('/get/teacher/student',middlewares.admin({handle:"haveTeacherStudent"}),controller.teacher.haveTeacherStudent);


//��ȡ��ʦѧ���б�

router.post('/update/teacher/student',middlewares.admin({handle:"updateTeacherStudent"}),controller.teacher.updateTeacherStudent);

//��ȡʱ���б�

router.post('/get/time',middlewares.admin({handle:"getSetTime"}),controller.teacher.getSetTime);

//����µ���ʦ

router.post('/add/new/teacher',middlewares.admin({handle:"addNewTeacher"}),controller.teacher.addNewTeacher);

//ɾ���������

router.post('/delete/movie',middlewares.admin({handle:"deleteMovie"}),controller.movie.deleteMovie);

//�����������

router.post('/update/movie',middlewares.admin({handle:"updateMovie"}),controller.movie.updateMovie);

//����ʱ��

router.post('/update/time',middlewares.admin({handle:"updateTime"}),controller.teacher.updateTime);

//����µ�֪ͨ

router.post('/add/new/message',middlewares.admin({handle:"addNewNotice"}),controller.message.addNewNotice);

//���½�ʦ����

router.post('/update/teacher/ps',middlewares.admin({handle:"updatePS"}),controller.teacher.updatePs);

//ɾ����ʦ����

router.post('/delete/mission',middlewares.admin({handle:"deleteMission"}),controller.teacher.deleteMission);


//���½�ʦ��Ϣ

router.post('/update/teacher/info',middlewares.admin({handle:"updateTeacherInfo"}),controller.teacher.updateTeacherInfo);

//ɾ����ʦ��Ϣ

router.post('/delete/teacher/info',middlewares.admin({handle:"deleteTeacherInfo"}),controller.teacher.deleteTeacherInfo);
 

//��ȡȨ�޿��ƽ�ɫ

router.post('/get/permission/list',middlewares.admin({handle:"getRole"}),controller.permission.getRoles);

//���Ȩ�޿��ƽ�ɫ

router.post('/add/new/role',middlewares.admin({handle:"addNewRole"}),controller.permission.addNewRole);

//����Ȩ�޿��ƽ�ɫ

router.post('/update/role',middlewares.admin({handle:"updateRole"}),controller.permission.updateRole);


//ɾ��Ȩ�޿��ƽ�ɫ

router.post('/delete/role',middlewares.admin({handle:"deleteRole"}),controller.permission.deleteRole);

//��ȡȨ�޿���ģ��

router.post('/get/modules',middlewares.admin({handle:"getModules"}),controller.permission.getModules);

//����Ȩ�޿���ģ��

router.post('/update/module',middlewares.admin({handle:"updateModule"}),controller.permission.updateModule);

//ɾ��Ȩ�޿���ģ��

router.post('/delete/module',middlewares.admin({handle:"deleteModule"}),controller.permission.deleteModule);

//���Ȩ�޿���ģ��

router.post('/add/new/module',middlewares.admin({handle:"addNewModule"}),controller.permission.addNewModule);

//��ȡȨ�޿��Ʋ���

router.post('/get/handle',middlewares.admin({handle:"getHandle"}),controller.permission.getHandle);


//����Ȩ�޿��Ʋ���

router.post('/update/handle',middlewares.admin({handle:"updateHandle"}),controller.permission.updateHandle);

//���Ȩ�޿��Ʋ���

router.post('/add/new/handle',middlewares.admin({handle:"addNewHandle"}),controller.permission.addNewHandle);


//ɾ��Ȩ�޿��Ʋ���

router.post('/delete/handle',middlewares.admin({handle:"deleteHandle"}),controller.permission.deleteHandle);

//�ı�Ȩ�޿��Ʋ���

router.post('/change/handle',middlewares.admin({handle:"changeHandle"}),controller.permission.changeHandle);




    };
