const LocalStrategy=require('passport-local').Strategy
const mongoose =require('mongoose')
const passport=require('passport')
const User = require('../modules/user/model')

passport.use(new LocalStrategy({
    usernameField:'email',
},
    async(email,password, done)=>{
        try{
            const user= await User.findOne({email})
            if(!user) {
                // console.log('no user')
                return done(null, false, {message: "Incorrect Email"})                
            }

            if  ( await user.checkPassword(password)) return done(null, user)
            // console.log('no password')
            return done(null, false, {message: "Incorrect Password"})
        }
        catch(e){
            // console.log('thre iss ')
            return done(e)
        } 
    }
))

passport.serializeUser((user,done)=>{
    // console.log('thre iss ')
    return done(null,user._id)
})

passport.deserializeUser(async (_id,done)=>{
    try{
        const user= await User.findOne({_id}) 
        return done(null,user)
    }
    catch(e){
// console.log('there is')
        return done(e)
    }
})


