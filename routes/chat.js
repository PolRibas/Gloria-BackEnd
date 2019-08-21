var express = require('express');
var router = express.Router();

const Chat = require('../models/Chat');

/* GET home page. */
router.put('/postMessage/:id', async (req, res, next) => {
    console.log(req.body.body)
    console.log(req.params.id)
    await Chat.findOneAndUpdate({idChat: req.params.id},{$push: {chat: req.body.body}})
  res.status(200).json('ok');
});

router.get('/getChat/:id', async (req, res, next) => {
    const chat = await Chat.find({idChat: req.params.id})
    console.log(chat)
    let newChat = []
    if(chat.length){
      newChat = chat;
    }else{
     newChat = await Chat.create({idChat: req.params.id})
    }
    res.status(200).json(newChat);
  });

module.exports = router;