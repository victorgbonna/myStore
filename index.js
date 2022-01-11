require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const session=require('express-session')
const passport=require('passport')
const methodOver=require('method-override')
const path=require('path')
const config=require('./config/config')
const logger=require('morgan')
const connectDB=require('./config/db')
const MongoStore= require('connect-mongo')(session)
const { flashMessages } = require('./middlewares/middleware')

require('./config/passport')

const authRoute=require('./routes/auth')
const cartRoute=require('./routes/cart')
const productRoute=require('./routes/product')
const paymentRoute=require('./routes/payment')
const apiRoute=require('./routes/api/product')
const cartapiRoute=require('./routes/api/cart')
const { getProducts } = require('./modules/product/service')
const{formatDate,truncate}=require('./helpers/frontend')


connectDB()
const app= express()
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOver('_method'))

app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized:true,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cokie:{secure: true} 
}))

app.use(passport.initialize())
app.use(passport.session())

//Passport
app.locals.message={}
app.locals.formatDate=formatDate
app.locals.truncate=truncate

if(process.env.NODE_ENV === 'development'){
    app.use(logger('dev'))
} 

app.use((req, res, next) =>{
    // res.locals.user=req.isAuthenticated() ? req.user :null
    res.locals.user=req.user || null
    res.locals.cart= req.session.cart || {}
    next()
})
// console.log(process.env.MONGODB_URI)

app.use('/', cartRoute)
app.use('/', cartapiRoute)
app.use('/', authRoute)
app.use('/payment', paymentRoute)
app.use('/product', productRoute)
app.use('/api/product', apiRoute)



app.get('/home', flashMessages, async(req,res)=>{
    const {products,meta} = await getProducts(req.query)
    console.log(meta)
    res.render('index', {title:'Home', products,meta})
})
app.get('/', flashMessages, async(req,res)=>{
    const {products,meta} = await getProducts(req.query)
    console.log(meta)
    res.render('index', {title:'Home', products,meta})
})  


app.listen(config.port,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} on port ${config.port}`);
})