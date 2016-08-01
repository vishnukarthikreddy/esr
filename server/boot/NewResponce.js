/**
 * Created by asinsing on 7/29/2016.
 */


/*
*/



/**
 * Created by asinsing on 5/26/2016.
 */
module.exports = function(server) {
  var remotes = server.remotes();


  remotes.before('**', function(ctx, next){

    console.log("actual method: "+ctx.req.originalUrl);
    if (ctx.req.originalUrl.toString().indexOf('/api/Resources/login') > -1 ){
      ctx.req.body['ttl'] = 3600;
      console.log('Entered..'+JSON.stringify(ctx.req.body));
      next();
    }else {
      console.log('Entered...............');
      next();
    }
  });

  remotes.afterError('**', function(ctx,next) {
    next();
  });

  remotes.after('**', function (ctx, next) {

    if (ctx.req.originalUrl.toString().indexOf('/api/Resources/login') > -1) {
      var expireTime = new Date(ctx.result.created.getTime()+(ctx.result.ttl*1000));
      console.log('Expire Time'+expireTime);
      ctx.result['expireTime'] = expireTime;
      console.log('Entered Result..'+JSON.stringify(ctx.result));
      next();
    }
    else {
      next();
    }

  });





};



