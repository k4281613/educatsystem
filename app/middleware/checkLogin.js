module.exports = options => {
    return async function (ctx, next) {
        const {token, role} = ctx.request.header;
        const table = role === 'student' ? 'system_user' : 'teacher';
        const user = await ctx.app.mysql.get(table, {u_id: token});
        if (user) {
            await next();
        } else {
            ctx.body = {
                status: -1,
                message: 'fail'
            }
        }
    };
};