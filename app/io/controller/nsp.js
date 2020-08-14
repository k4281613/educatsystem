const Controller = require('egg').Controller;

class NspController extends Controller {

    async closesocket(){
        const { ctx, app } = this;
        const message = ctx.args[0];
        const socket=ctx.socket;
        const nsp=app.io.of('/online');
        //console.log(message,socket.id);
        const result={
            status:1,
            text:'closed socket'
        }
        socket.emit('closeRes', result);
        socket.disconnect();
    }
    async heartmove(){
        const { ctx, app } = this;
        const message = ctx.args[0];
        //console.log(message);
        await app.io.of('/online').clients((err,clients)=>{
            //console.log(clients);
            if (err) throw err;
            const result = ctx.service.nsp.heartmove(message.id,clients);
            //console.log(result);
            result.then((val)=>{
                app.io.of('/online').emit('heartmoveRes', val);
            })
        })
    }
    async JoinRoom() {
        const { ctx, app } = this;
        const payload = ctx.args[0].payload;
        const socket = ctx.socket;
        const client = socket.id;
        const room = client;
        console.log(payload);
        socket.join(room);
        const result=await ctx.service.nsp.joinroom(payload.id,payload.status,payload.submit_time,room);
        const key= `stu_inexper_${payload.id}`;
        const data=await app.redis.get(key);
        if(data!=null){
            result.data=JSON.parse(data);
        }
        await app.io.of('/online').to(room).emit('joinRes', result);
    }
    async senData(){
        const { ctx, app } = this;
        const message = ctx.args[0];
        const room = message.room;
        const payload=message.payload;
        const key= `stu_inexper_${payload.id}`;
        app.redis.set(key,JSON.stringify(payload));
        //console.log(message);
        await app.io.of('/online').clients((err,clients)=>{
            //console.log(clients);
            if (err) throw err;
            const result = ctx.service.nsp.heartmove(message.room,clients);
            result.then((val)=>{
                //console.log(val);
                var result;
                if(val.bool){
                    result={
                        status:1,
                        room:room,
                        text:`成功收到数据`,
                    }
                    app.io.of('/online').to(room).emit('senDataRes', result);
                }else {
                    result={
                        status:0,
                        room:room,
                        text:val.text,
                    }
                    app.io.of('/online').emit('senDataRes', result);
                    ctx.service.onlineExperStudent.subexper(payload.id,payload.status,payload.surplus_time,payload.submit_time,payload.questions);
                }
            })
        })
    }
    async LeaveRoom() {
        const { ctx, app } = this;
        const message = ctx.args[0];
        const payload=message.payload;
        const socket = ctx.socket;
        const client = socket.id;
        const room=client;
        const key= `stu_inexper_${payload.id}`;
        //console.log(message);
        const result={
            status:1,
            room:room,
            text:`已离开房间:${room},作业已提交`,
        };
        await app.io.of('/online').to(room).emit('leaveRes', result);
        socket.leave(room);
        await ctx.service.onlineExperStudent.subexper(payload.id,payload.status,payload.surplus_time,payload.submit_time,payload.questions);
        await app.redis.del(key);
    }
    async lookroom(){
        const { ctx, app } = this;
        const message = ctx.args[0];
        const room=message.room || '';
        const nsp=app.io.of('/online');
        //console.log(message);
        await nsp.to(room).clients((err,clients)=>{
            //console.log('#online_look', clients);
            if (err) throw err;
            if(clients.length==0){
                nsp.emit('lookRes', {
                    room:room,
                    message: `无该房间`
                });
            }else {
                nsp.to(room).emit('lookRes', {
                    clients,
                    room:room,
                    message: `当前用户列表`
                });
            }
        })
    }
}

module.exports = NspController;