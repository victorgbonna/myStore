const mongoose= require('mongoose')
const ItemSchema= new mongoose.Schema({
  phone: {
    type: String,
  },
  price: {
    type: Number,
  },
  qty: {
    type: Number,
  },
},{_id:false})
// const slugify=require('slugify')
const PaymentSchema= new mongoose.Schema({
    full_name: {
      type: String,
      required: true,
  },
  phone: {
      type: String,
      required:true
  },
  amount: {
      type: Number,
      required: true,
  },
  items : [
    ItemSchema
  ],
  reference: {
      type: String,
      required: true
  }

})

const Payment= mongoose.model('Payment', PaymentSchema)
module.exports= Payment