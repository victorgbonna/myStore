const express= require('express')
const passport= require('passport')
const {flashMessages,adminRequired, guestOnly}= require('../middlewares/middleware')
//const User=require('../modules/user/model')
const Product=require('../modules/product/model')
const { getAproduct } = require('../modules/product/service')
// const addUser = require('../modules/user/service')
const router=express.Router()


router.get('/create',flashMessages,adminRequired, async (req,res)=>{
    if(!req.isAuthenticated()){
        return redirect('index')
    }
    return res.render('admin/create', {title:'Create Product'})
})


// router.get('/', flashMessages, async (req, res) => {
    // const {products,meta} = null
    // console.log('categories list', categories)
//     return res.render('product/all_products')
// })
  
router.get('/:slug', async (req, res) => {
    // console.log(req.params)
    const {product,subProducts}= await getAproduct({slug:req.params.slug})
    // console.log(req.param
    // console.log(product)
    return res.render('product/product', {title:'Product-'+product.slug,product,subProducts})
})

router.get('/:slug/edit',flashMessages,adminRequired, async (req,res)=>{
    const {product}= await getAproduct({slug:req.params.slug})
    return res.render('admin/edit', {title:'Edit Product-'+product.slug, product})
})
  

module.exports=router