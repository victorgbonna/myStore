const express = require('express')
const router = express.Router()
// const { addCategory,getCategories, destroyCategory } = require('../../modules/category/services/categoryService')
const Cart  = require('../../modules/cart/model')
const Product=require('../../modules/product/model')


router.get('/add-to-cart/:id', async(req,res)=>{
    let id=req.params.id
    // console.log(id)
    const product=await Product.findById(id)
    if(!product){return res.redirect('/')}
    // console.log(id)
    let cart= new Cart(req.session.cart?req.session.cart:{items:{}})
    cart.add(product,product.id)
    req.session.cart=cart
    req.session.flashData={
        message:{ 
          type: 'green',
          body: 'Product added to cart'
        }
      }
    // console.log('jj',cart)
    // console.log(product)
    return res.redirect('/shopping-cart')
})
router.delete('/remove-from-cart/:id', (req,res)=>{
    if(!req.session.cart){
        return res.redirect('/')
    }
    let id=req.params.id
    // console.log(id)
    let cart= new Cart(req.session.cart)
    cart.delete(id)
    if(cart.totalQty==0){            
        cart=null        
    }
    req.session.cart=cart
    // console.log('jj',cart)
    // console.log(product)
    req.session.flashData={
        message:{ 
          type: 'green',
          body: 'Product removed from cart'
        }
      }
    return res.redirect('/shopping-cart')
})
router.put('/update-cart',(req,res)=>{
    if(!req.session.cart){  
        return res.redirect('/')
    }
    let body=req.body
    // console.log(req.body)
    let cart= new Cart(req.session.cart)
    cart.update(body)
    req.session.cart=cart
    let cartTotalPrice=cart.totalPrice
    let cartTotalQty=cart.totalQty
    req.session.flashData={
        message:{ 
          type: 'green',
          body: 'Cart has been updated'
        }
      }
    // console.log(cart)
    return res.json({body,cartTotalPrice, cartTotalQty})
})

module.exports=router