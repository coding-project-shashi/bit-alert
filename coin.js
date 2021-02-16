const mongoose = require('mongoose');
const schema=mongoose.Schema;
const coinSchema = new schema({
 title:{
     type:String,
     required:true
 },
 price:{
    type:String,
    required:true
},
date:{
    type:String,
    required:true
},
currentValue:{
    type:String,
    required:true
}
},
{timestamps:true}
);
const coin = mongoose.model('CoinProd',coinSchema);
module.exports = coin;