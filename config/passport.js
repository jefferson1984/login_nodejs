const LocalStrategy=require('passport-local').Strategy
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')


//usando model
const User=require('../modulos/user')

module.exports=function(passport) {
   passport.use(
       new LocalStrategy({usernameField:'email'},(email,password,done)=>{
       // confirmacao email
       User.findOne({email:email})
       .then(user=>{
           if(!user){
           return done(null,false,{message:'Email não está registrado'})
           }
           //confirmacao senha
           bcrypt.compare(password,user.password,(err,isMatch)=>{
               if(err) throw err
               if(isMatch){
                   return done(null,user)
               }else{
                   return done(null,false,{message:'senha está incorreta'})
               }
           })
       })
       .catch(err=>console.log(err))
       })
   ) 

   passport.serializeUser((user,done)=>{
       done(null,user.id)
   }) 

   passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user)
    })
}) 


}

