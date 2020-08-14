

module.exports =options => {
  return async function (ctx, next) {
    const {role,token} = ctx.request.header
    const table = role==="student"?'system_user':'teacher'
    const user = await ctx.app.mysql.get(table, {
      u_id:token
    });

     if(!user){
     ctx.body={
         status:-1,
         message:"您没有操作权限"
      }
      return;
     }
    
    const sql = "select h.* from permission_roles r join permission_module m on r.id=m.r_id join permission_handle h on m.id=h.m_id  where r.name=? and h.status=1"
     const permission = await ctx.app.mysql.query(sql,[user.role])
       
     if(permission.length>0){
       let flag = false
       permission.forEach(item=>{
           if(item.name==options.handle){
                 flag =true
            }
      })
       if(flag){
          await next();
       }else{
        ctx.body={status:-1,message:"您没有操作权限"}
        }
      
     }else{
        ctx.body={status:-1,message:"您没有操作权限"}
     }
    
  }
};
