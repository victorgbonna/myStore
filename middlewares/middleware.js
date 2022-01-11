const flashMessages=(req, res,next)=>{
    if(req.session.flashData){
        // console.log(req.session.flashData)
        for (const key in req.session.flashData){
            res.locals[key] = req.session.flashData[key]
        }
        console.log(res.locals.message)
        req.session.flashData= null
    }
    return next()
}

const adminRequired=(req,res,next)=>{
    if(req.isAuthenticated() && req.user.isAdmin) return next()
    // req.session.redirectUrl=req.baseUrl+req.url
    req.session.flashData={
        message:{ 
            type: 'warning',
            body: 'Unauthorized Access'
        }
    }
    // req.flash('warn', "You must me logged")
    res.redirect('/')
}
const guestOnly=(req,res,next)=>{
    if(!req.isAuthenticated()) return next()
    req.session.flashData={
        message:{ 
            type: 'warning',
            body: 'You are already logged in'
        }
    }
    res.redirect('/')
}

module.exports= {flashMessages, adminRequired, guestOnly}