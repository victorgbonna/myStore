const mongoose= require('mongoose')
const bcrypt= require('bcrypt')

const UserSchema= new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    index:true
  },
  password:{
      type: String,
      required: true
  },
  isAdmin:{
    type: Boolean,
    default: true
  },
  createdAt:{
      type: Date,
      default: Date.now
  }
})
UserSchema.path('email').validate(async(email) => {
    const emailCount=await mongoose.models.User.countDocuments({email})
    return !emailCount
},'Email already exists')

UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) next()
    this.password= await bcrypt.hash(this.password,10)
    next()
})
UserSchema.methods.checkPassword= async function(password){
    // console.log(password)
    const result= await bcrypt.compare(password, this.password)
    return result
}
const User= mongoose.model('User', UserSchema)
module.exports= User