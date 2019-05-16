const express=require('express')

const rotas=express.Router()
const bcrypt=require('bcryptjs')
const passport=require('passport')

//modulos
const User=require('../modulos/user')

//página de login
rotas.get('/login',(req,res)=>res.render('login'))

//página de registro
rotas.get('/registro',(req,res)=>res.render('registro'))

//registro
rotas.post('/registro',(req,res)=>{
    const {name,email,password,password2}=req.body

    //verificar campos obrigatorios
    let erros=[]
    if(!name||!email||!password||!password2){
        erros.push({msg:'Por favor preencha os campos'})
    }
    // verificando senha
    if(password!==password2){
        erros.push({msg:'senha não confere'})
    }
    // verificando tamanho da senha
    if(password.length<6){
        erros.push({msg:'sua senha deve ter no minimo 6 caracteres'})
    }
    if(erros.length>0){
       res.render('registro',{
           erros,
           name,
           email,
           password,
           password2
       })
    }else{
        //validado
        User.findOne({email:email})
        .then(user=>{
            if(user){
                //usuario existe
                erros.push({msg:'email já está registrado'})
                res.render('registro',{
                    erros,
                    name,
                    email,
                    password,
                    password2
                })
            }else{
                const newUser=new User({
                    name,
                    email,
                    password
                })
            
               //hash criptografia
               bcrypt.genSalt(10,(err,salt)=>
               bcrypt.hash(newUser.password,salt,(err,hash)=>{
                   if(err)throw err
                   
                   newUser.password=hash
                   // salvando usuario
                   newUser.save()
                   .then(user=>{
                       req.flash('success_msg','Registrado com sucesso')
                       res.redirect('/usuarios/login')
                   })
                   .catch(console.log(err))
               }))


            }

            
        })
    }
})

//login
rotas.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/usuarios/login',
        failureFlash:true
    })(req,res,next)
})

//logout dashboard
rotas.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success_msg','você não esta mais logado')
    res.redirect('/usuarios/login')
})
module.exports =rotas