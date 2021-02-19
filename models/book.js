const mongoose = require('mongoose')
const fs=require('fs')
const path=require('path')
const { pathToFileURL } = require('url')
const coverImageBasePath ='uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String
    },
    link:{
       type: String,
       required: true
    },
    language:{
        type: String,
        required:true
    },
    coverImageName:{
        type: String,
        required:true
    },
    author :{
        type: String,
        required:true,
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName !=null)
    {
        return path.join('/',coverImageBasePath,this.coverImageName)
    }
})

module.exports=mongoose.model('Book',bookSchema)
module.exports.coverImageBasePath=coverImageBasePath