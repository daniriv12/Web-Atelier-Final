module.exports.supportedMethods = function(commaSeperatedMethods){
  var supMethods = commaSeperatedMethods.split(', ').map(function(method){
    return method.trim();
  });
  return function(req, res, next){
    if(supMethods.indexOf(req.method) < 0 ){
      return res.status(405).send('Method Not Allowed');
    }
    next();
  };
}


module.exports.authorize = function(req, res, next) {
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
};