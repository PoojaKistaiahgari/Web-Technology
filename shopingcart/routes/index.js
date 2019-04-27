var express = require('express');
var router = express.Router();
var Cart=require('../models/cart');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping',{useNewUrlParser:true});

var Product=require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err,docs){
    var productChunks=[];
    var chunkSize=3;
for(var i=0;i<docs.length;i+=chunkSize)
{
  productChunks.push(docs.slice(i,i+chunkSize));
}
    res.render('shop/index', { title: 'ghadiya.com',products:productChunks});
});
});
router.get('/add-to-cart/:id',function(req,res,next){
var productId=req.params.id;
var cart=new Cart(req.session.cart ? req.session.cart:{});
Product.findById(productId,function(err,product){
if(err){
  return res.redirect('/');
}
cart.add(product,product.id);
req.session.cart=cart;
console.log(req.session.cart);
res.redirect('/');
});
});
router.get('/reduce/:id',function(req,res,next){
  var productId=req.params.id;
  var cart=new Cart(req.session.cart ? req.session.cart :{});
  cart.reduceByone(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
}); 
router.get('/increase/:id',function(req,res,next){
  var productId=req.params.id;
  var cart=new Cart(req.session.cart ? req.session.cart :{});
  cart.addByone(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
}); 



router.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart)
  {
    return res.render('shop/shopping-cart',{products:null});

  }
  var cart=new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products:cart.generateArray(),totalPrice:cart.totalPrice});

});
router.post('/insert',function(req,res,next){
  var products= new Product({
  imagePath: req.body.image,
  title: req.body.title,
  description: req.body.description,
  price: req.body.price
  });
  products.save();
  res.redirect('/shop/adminindex');
  });

router.get('/delete/:id',function(req,res,next){
  mongoose.model("Product").remove({_id:req.params.id},function(err,delData){
    res.redirect("/shop/adminindex");
    });
});
router.get('/checkout',function(req,res,next){
  if(!req.session.cart)
  {
    return res.redirect('/shopping-cart');
  }
  req.session.cart=null;
  res.render('shop/checkout');

});

router.get('/shop/bag',function(req,res,next){
  res.render('shop/bag');
});

router.get('/shop/laptops',function(req,res,next){
  res.render('shop/laptops');
});

router.get('/shop/cycles',function(req,res,next){
  res.render('shop/cycles');
});

router.get('/shop/all',function(req,res,next){
  res.render('shop/all');
});

module.exports = router;

