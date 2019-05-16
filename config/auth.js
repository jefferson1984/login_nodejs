module.exports={
  ensureAuthenticated:function(req,res,next){
     if(req.isAuthenticated()){
         return next()
     }
     req.flash('error_msg','você não está logado')
     res.redirect('/usuarios/login')
    }
}