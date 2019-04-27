var express = require('express');
var router = express.Router();
var Cart=require('../models/cart');
var csrf=require('csurf');
var passport=require('passport');


var Product=require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/adminindex', function(req, res, next) {
  Product.find(function(err,docs){
    var productChunks=[];
    var chunkSize=3;
for(var i=0;i<docs.length;i+=chunkSize)
{
  productChunks.push(docs.slice(i,i+chunkSize));
}
    res.render('shop/adminindex', { title: 'ghadiya.com',products:productChunks});
});
});
router.get('/create',function(req,res,next){
    res.render('shop/createnew');
});
module.exports=router;