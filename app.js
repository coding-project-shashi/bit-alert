const express = require('express');
const moment = require('moment');
const axios =require('axios').default;
const mongoose = require('mongoose');
const coin =require('./coin');
const cron = require('node-cron');
var nodemailer = require('nodemailer');

mongoose.connect('mongodb+srv://shashikiran:My@21031998@cluster0.mk2f0.mongodb.net/bit-alert?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const app = express();

cron.schedule('* * 5 * *', function() {
    cronjob();
  });

const db = mongoose.connection;
db.once('open',()=>{console.log('connected');});
function callEveryinterval(interval) {
    setInterval(()=>{
        mainFunction();
        },1000 * 60 * 30);
}

app.listen(5000,()=>{
    console.log('server started');
    callEveryinterval();
});

async function mainFunction()  {
   const bitcoin = 0.0028;
   const threshold = 9000;
   let CoinData;
   await axios.get("https://api.nomics.com/v1/currencies/ticker?key=d8bfe1c5571f5459f4c974eb0e84f3c4&ids=BTC&interval=1h&convert=INR")
  .then(response => CoinData=response.data[0]);
  const current=bitcoin * parseFloat(CoinData.price);
  if(current<=threshold) {
      cronjob();
  }
  const coinModel = new coin({
      title: CoinData.currency,
      price:CoinData.price,
      date:moment(CoinData.price_date).format('MMMM Do YYYY, h:mm:ss a'),
      currentValue: (current).toString(),
  });
   coinModel.save(coinModel);  
}

function cronjob() {
    coin.findOne({},
         {},
          { sort: { 'created_at' : -1 } },
           function(err, post) {
                  var post1 = {
                      price:post.price,
                      current:post.currentValue,
                      date:moment(post.date).format('MMMM Do YYYY, h:mm:ss a'),
                      createdAt:moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a')
                  }
                  axios.post('https://hooks.slack.com/services/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', {
                      text:JSON.stringify(post1)
      });}
    );
}



