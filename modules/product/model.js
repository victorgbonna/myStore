const mongoose= require('mongoose')
const slugify=require('slugify')
const ProductSchema= new mongoose.Schema({
  category:{
    type:String,
    required:true
  },
  name:{
    type: String,
    required: true
  },
  old_price:{
    type: Number,
    default: true
  },
  new_price:{
    type: Number,
    default: true
  },
  description:{
    type: String,
    required: true
  },
  img_files:{
    type:Array
  },
  available:{
    type: Boolean,
    default: true
  },
  createdAt:{
      type: Date,
      default: Date.now
  },
  slug: {
    type: String,
    unique:true
  }
})
ProductSchema.pre('save', async function(next){
  const slugCount= await mongoose.models.Product.countDocuments({name:this.name})
  if(slugCount){ 
    let name=this.name+' '+slugCount
    console.log(name)
    this.slug=slugify(name,{lower:true,strict:true})
  }
  else{
    this.slug=slugify(this.name,{lower:true,strict:true})
  }

  next()
})

ProductSchema.pre('findOneAndUpdate', async function(next){
  // console.log('yes')
  // if(!this._update.name) next()
  // console.log(this._update)
  const slugCount= await mongoose.models.Product.countDocuments({name:this._update.name})
  if(slugCount){ 
    let name=this._update.name+' '+slugCount
    // console.log(name)
    this._update.slug=slugify(this._update.name,{lower:true,strict:true})
  }
  else{
    this._update.slug=slugify(this._update.name,{lower:true,strict:true})
  }
  next()
})

const Product= mongoose.model('Product', ProductSchema)
module.exports= Product