const express = require('express')
const author = require('../models/author')
const multer= require('multer')
const path=require('path')
const fs=require('fs')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const Request= require('../models/requests')
const uploadPath=path.join('public',Book.coverImageBasePath)
var cloudinary=require('cloudinary').v2
const { request } = require('http')

cloudinary.config({
    cloud_name: 'dz9xduywu',
    api_key: '697598252786474',
    api_secret: 'Bfl5BKqFrennMpf0oTbgbvo0mDQ'
})

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


//Requesting A Topic
router.get('/getreq',async(req,res)=>{
    
    const got = await Request.find()
    console.log(got)
    try{
    res.render('books/getreq',{
        showreq: got
    })
    }
    catch{
        res.redirect('/')
    }
})

router.get('/new',async (req,res)=>{
    renderNewPage(res,new Book())
})

router.get('/request',async (req,res)=>{
    res.render('books/request')
 })

 router.get('/auth',async (req,res)=>{
    res.render('books/auth')
 })

 router.get('/cat',async (req,res)=>{
    res.render('books/category')
 })

 

 router.get('/:id',async(req,res)=>{
    

    const books=await Book.findById(req.params.id)
    res.render('books/one',{
       meh: books
    })
 })
 


// New book route



router.post('/auth',(req,res)=>{


    var name=req.body.userName
    var pass=req.body.password
    if(name=="sunitpicherloomkat"&& pass=="iron_man#2837")
    {
          res.redirect('/books/new')
    }
    else
    {
        res.render('books/auth',{
            errorMessage: 'Wrong Username Or Password'
        })
    }
})




router.post('/cat',async(req,res)=>{
    const author = new Author({
        name: req.body.name
    })


    try{
        const newAuthor= await author.save()  
        res.redirect('/')

    }catch{
        res.render('/',{
            errorMessage: 'Error Creating Author'
        })
    }
})
// creating book
router.post('/',upload.single('cover'),async(req,res)=>{
    
    
    var fileName = req.file!=null? req.file.filename:null
    cloudinary.uploader.upload(uploadPath+'/'+req.file.filename,{
        use_filename:true,
        unique_filename: false,
    }, function(result){
        console.log(result)

    })
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        coverImageName: fileName,
        language: req.body.language,
        link: req.body.link,
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


router.post('/request',async(req,res)=>{
    

    const requests = new Request({
        reqname: req.body.reqname,
        appeal: req.body.appeal
    })


    try{
        const newRequests= await requests.save()  
        res.render('./success')

    }catch{
        res.render('books/request',{
            errorMessage: 'Error Creating Author'
        })
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