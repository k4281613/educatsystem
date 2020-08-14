// app/io/middlewware/auth.js
module.exports = () => {
    return async (ctx, next) => {
        if(true){
            ctx.socket.emit('res', 'connected!');
            return;
        }
        await next();
        console.log('disconnection!');
    }
};