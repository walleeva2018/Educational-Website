const express = require('express')
const author = require('../models/author')
const multer= require('multer')
const path=require('path')
const fs=require('fs')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath=path.join('public',Book.coverImageBasePath)
const imageMimeTypes=['image/jpeg','image/png','images/gif']
const upload=multer({
    dest: uploadPath,
    fileFilter: (req,file,callback)=>{
        callback(null,imageMimeTypes.includes(file.mimetype))
    }
})


// All book route
router.get('/',async(req,res)=>{
   
   let query = Book.find()
   if(req.query.title!= null && req.query.title != ''){
       query=query.regex('title',new RegExp(req.query.title,'i'))
   }
    try{
    const books= await query.exec()
    res.render('books/index',{
        books: books,
        searchOptions : req.query
    })
   }catch{
       res.redirect('/')
   }
})

// New book route
router.get('/new',async (req,res)=>{
   renderNewPage(res,new Book())
})

// creating book
router.post('/',upload.single('cover'),async(req,res)=>{
    const fileName = req.file!=null? req.file.filename:null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        coverImageName: fileName,
        language: req.body.language,
        description: req.body.description
    })

    try{
        const newBook= await book.save()
        res.redirect('books')
    }catch{
        if(book.coverImageName != null)
        {
            removeBookCover(book.coverImageName)
        }
             renderNewPage(res,book,true)
    }
})


function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath,fileName), err =>{
        if(err) console.error(err)
    })
}
async function renderNewPage(res,book,hasError=false){
    try{
        const authors= await Author.find({})
        const params={
            authors:authors,
            book: book
        }
        if(hasError)params.errorMessage='Error creating Books'
        res.render('books/new',params)
    }catch{
        res.redirect('/books')
    }
}
module.exports=router