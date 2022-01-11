const express= require('express')
const passport= require('passport')
const {flashMessages,adminRequired, guestOnly}= require('../middlewares/middleware')
const User=require('../modules/user/model')
// const Post=require('../modules/post/models/Post')
const {addUser} = require('../modules/user/service')
const router=express.Router()



router.get('/admin/register',flashMessages, adminRequired, async (req,res)=>{
    return res.render('admin/register', {title:'Register'})
})

router.post('/register', async (req,res)=>{
    try{
        const user=await addUser(req.body)
        req.session.flashData={
            message:{ 
                type: 'green',
                body: 'Registration successful'
            }
        }   
        res.redirect('/')
    }
    catch(e){
        console.log(e)
        req.session.flashData={
            message:{ 
                type: 'green',
                body: 'Something went wrong'
            }
        }
        res.redirect('register')
        // res.render(e)
    }
})
router.get('/login',flashMessages, guestOnly, (req,res)=>{
    return res.render('login', {title:'Login'})
})

router.post('/login', (req,res, next) =>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            console.log('ther ean error in login')
            console.error('Err: ',err)
            req.session.flashData={
                message:{ 
                    type: 'red',
                    body: 'Something went wrong'
                }
            }   
            return res.redirect('/login')
        }
        if (!user){
            req.session.flashData={
                message:{ 
                    type: 'red',
                    body: info.message
                }
            }   
            return res.redirect('/login')
        } 

        req.login(user,(err)=>{
            if(err){
                console.error('Err: ',err)
                req.session.flashData={
                    message:{ 
                        type: 'red',
                        body: 'Login Failed'
                    }
                } 
            }
            // console.log(user)
            req.session.flashData={
                message:{ 
                    type: 'green',
                    body: 'Logged in successfully'
                }
            }
            // console.log('dhhd')
            // console.log(req.user)

            return res.redirect('/') 
        })
    })(req,res,next)
})
// router.post('/login-check', passport.authenticate('local', 
//     {successRedirect:'/ailed',failureRedirect:'/success'}
// ))
router.get('/logout', (req,res)=>{
    if (!req.isAuthenticated()){
        res.status(400).render("error/400", {title:' 400 Error'})
    }
    else{
        req.session.flashData={
            message:{ 
                type: 'green',
                body: 'Logout succesfully'
            }
        }
        req.logout()
        return res.redirect('/')
    }
})

module.exports=router