const Service = require('egg').Service;

class PermissionService extends Service {

    async getRoles() { // ��ȡȨ�޽�ɫ�б�

        const results = await this.app.mysql.select('permission_roles', {
        });
   
        if (results) {

            return {
                status:1,
                message: 'ok',
                roleList:results
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    }  

   async getHandle(id) { 

        const results = await this.app.mysql.select('permission_handle', {
                where:{m_id:id}
        });
   
        if (results) {

            return {
                status:1,
                message: 'ok',
                handles:results
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    }  


 async getModules(id) { // ��ȡȨ�޽�ɫ�б�

        const result = await this.app.mysql.select('permission_module', {
                  where:{r_id:id}
        });
   
        if (result) {
            return {
                status:1,
                message: 'ok',
                modules:result
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    }  

 async addNewRole(form) { // ���Ȩ�޽�ɫ

        const result = await this.app.mysql.insert('permission_roles', {
               time:form.time,
               name:form.name,
               role_desc:form.role_desc,
               status:1
        });
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    }  

 async addNewModule(form) { 

        const result = await this.app.mysql.insert('permission_module', {
               time:form.time,
               r_id:form.r_id,
               name:form.name,
               module_desc:form.module_desc,
              status:1
        });
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    }  

 async addNewHandle(form) { 

        const result = await this.app.mysql.insert('permission_handle', {
               time:form.time,
               m_id:form.m_id,
               name:form.name,
               handle_desc:form.handle_desc,
              status:1
        });
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    }  


 async updateRole(form) { // ����Ȩ�޽�ɫ

        const result = await this.app.mysql.update('permission_roles', {
               time:form.time,
               name:form.name,
               role_desc:form.role_desc
        },{where:{id:form.id}});
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    } 


 async updateHandle(form) { 

        const result = await this.app.mysql.update('permission_handle', {
               time:form.time,
               name:form.name,
               handle_desc:form.handle_desc
        },{where:{id:form.id}});
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    } 



async updateModule(form) { // ����Ȩ��ģ��

        const result = await this.app.mysql.update('permission_module', {
                time:form.time,
               name:form.name,
               module_desc:form.module_desc
        },{where:{id:form.id}});
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    } 

async changeHandle(handles,mid) {
        
        let sql = "update permission_handle set status=0 where m_id=? and id not in (?)"

      const result = await this.app.mysql.query(sql,[mid,handles])
     
       for(let i=0;i<handles.length;i++){

       await this.app.mysql.update('permission_handle', {
               status:1
        },{where:{m_id:mid,id:handles[i]}});
       }

        if (result) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    } 





 async deleteRole(id) { 

        const result = await this.app.mysql.delete('permission_roles', {
            id
        });
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    } 

 async deleteModule(id) { 

        const result = await this.app.mysql.delete('permission_module', {
            id
        });
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    } 


 async deleteHandle(id) { 

        const result = await this.app.mysql.delete('permission_handle', {
            id
        });
        if (result.affectedRows==1) {
            return {
                status:1,
                message: 'ok'
            }
        } else {
            return {
                 status:0,
                message: 'fail'
            }
        }
    } 



}

module.exports = PermissionService;