const mongoose = require('mongoose')
const requestSchema = new mongoose.Schema({
    reqname:{
        type: String,
        required:true
    },
    appeal:{
        type: String,
        required:true
    }


})

module.exports=mongoose.model('requests',requestSchema)