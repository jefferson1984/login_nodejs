const express=require('express')
const expressLayouts=require('express-ejs-layouts')
const mongoose=require('mongoose')
const flash=require('connect-flash')
const session=require('express-session')
const passport=require('passport')

const app=express()


//require('module').Module._initPaths();

//passport config
//process.env.NODE_PATH = __dirname;
require('./config/passport')(passport);

//configuração do banco de dados
const db=require('./config/chave').MongoURI

//conectando ao banco de dados

mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('mongodb conectado...'))
.catch(err=>console.log(err))



//EJS
app.use(expressLayouts)
app.set('view engine','ejs')

//bodyparser
app.use(express.urlencoded({extended:false}))

//express session

app.use(session({
   secret:"secret" ,
   resave:true,
   saveUninitialized:true,
 
}))

//passport
app.use(passport.initialize())
app.use(passport.session())


//conectando flash

app.use(flash())

//variaveis globais

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})


//Rotas
app.use('/',require('./rotas/index'))
app.use('/usuarios',require('./rotas/usuarios'))

const PORT=process.env.PORT||5000

app.listen(PORT,console.log(`servidor iniciado ${PORT}`))


