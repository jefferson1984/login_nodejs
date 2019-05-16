const express=require('express')

const rotas=express.Router()
const {ensureAuthenticated}=require('../config/auth')

//pagina inicial
rotas.get('/',(req,res)=>res.render('bemVindo'))

//dashboard
rotas.get('/dashboard',ensureAuthenticated,(req,res)=>
res.render('dashboard',{name: req.user.name}))

module.exports =rotas

