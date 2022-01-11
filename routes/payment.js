const express = require('express');
const path = require('path');
const request=require('request')
const Payment = require('../modules/payment/model')
const Cart = require('../modules/cart/model')

const _=require('lodash');
const { addPayment, getApayment } = require('../modules/payment/service');
const {initializePayment, verifyPayment} = require('../config/paystack')(request);
const router= express.Router()

router.get('/',(req, res) => {
    if(!req.session.cart){
        return res.render('cart', {title:'Shopping Cart', products: null, totalPrice:0})
    }
    cart=new Cart(req.session.cart)
    return res.render('pay', { totalPrice:cart.totalPrice});
});
router.post('/pay', (req, res) => {
    if(!req.session.cart){
        return res.render('cart', {title:'Shopping Cart', products: null, totalPrice:0})
    }
    // const form = _.pick(req.body,['email','full_name'])
    // const form={}
    cart=new Cart(req.session.cart)
    const products=cart.cartArray()
    const form ={}  
    form.amount=cart.totalPrice
    form.email=req.body.email
    // form.full_name=req.body.full_name
    form.metadata = {
        full_name : req.body.full_name,
        phone:req.body.phone,
        products:[]
    }
    form.amount *= 100;
    products.forEach(product => {
        form.metadata.products.push({
            name: product.item.name,
            price:product.price,
            qty: product.qty
        })
        console.log('this is them')
        console.log(product.item.name,product.item.price,product.qty)
    });
    console.log({form})
    initializePayment(form, (err, body)=>{
        if(err){
            //handle errors
            console.log(err);
            req.session.flashData={
                message:{ 
                    type: 'red',
                    body: 'Payment did not go through. Something went wrong'
                }
            }
            return res.redirect('/shopping-cart')
       }
       console.log({body})
       response = JSON.parse(body);
       res.redirect(response.data.authorization_url)
    });
});

router.get('/callback', async(req,res) => {
    const ref = req.query.reference;
    verifyPayment(ref, async (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return res.redirect('/error');
        }
        response = JSON.parse(body);
        console.log('response',response)
        console.log('items', response.data.metadata.products)
        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name', 'metadata.phone', 'metadata.products']);
        [reference, amount, email, full_name, phone, items] = data;
        // const products=response.data.metadata.products
        console.log({data})
        const newPayment = {reference, amount, email, full_name, phone, items}
        console.log({newPayment})
        try{ 
            const payment = await addPayment(newPayment)
            console.log('almost done')
            return res.redirect('/payment/receipt/'+payment._id)
        }
        catch(e){
            //handle errors
            console.log(e);
            req.session.flashData={
                message:{ 
                    type: 'red',
                    body: 'Payment did not go through. Something went wrong'
                }
            }
            return res.redirect('/shopping-cart')
            // console.log(e)
            // return res.json({e})
        }
        // new Payment(newPayment)
       
        
    //     payment.save().then((payment)=>{
    //         if(payment){
    //             res.redirect('/receipt/'+payment._id);
    //         }
    //     }).catch((e)=>{
    //         console.log(e)
    //         res.redirect('/error');
    //     })
    })
})
router.get('/receipt/:id', async (req, res)=>{
    const id = req.params.id;
    const payment=await getApayment(id)
    if(payment){
        req.session.flashData={
            message:{ 
              type: 'green',
              body: 'Payment was a success. We would notify you shortly'
            }
          }
        // res.send(payment)
        res.redirect('/home')
    }
    else{
        req.session.flashData={
            message:{ 
                type: 'red',
                body: 'Payment did not go through. Something went wrong'
            }
        }
        res.redirect('/shopping-cart')
    }
    
    // Payment.findById(id).then((payment)=>{
    //     if(!payment){
    //         //handle error when the donor is not found
    //         res.redirect('/error')
    //     }
    //     console.log({payment})
    //     res.send({success:'success'});
    // }).catch((e)=>{
    //     res.send({e})
    // });
});
// router.get('/error', (req, res)=>{
//     res.render('error');
// });
module.exports=router



