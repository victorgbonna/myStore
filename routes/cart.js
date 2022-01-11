const express= require('express')
const {flashMessages}= require('../middlewares/middleware')
const Cart = require('../modules/cart/model')

const router=express.Router()


router.get('/shopping-cart',flashMessages, async (req,res)=>{
    if(!req.session.cart){
        return res.render('cart', {title:'Shopping Cart', products: null, totalPrice:0})
    }
    cart=new Cart(req.session.cart)
    // console.log('This is the cart ')
    // console.log(' ')
    // console.log(cart)
    // console.log(cart.cartArray())
    // console.log(typeof cart.cartArray())
    return res.render('cart', {title:'Shopping Cart', products:cart.cartArray(), totalPrice:cart.totalPrice})
})
  

module.exports=router