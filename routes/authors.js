const express = require('express')
const author = require('../models/author')
const router = express.Router()
const Author = require('../models/author')
const Book =require('../models/book')

// All author route
router.get('/',async(req,res)=>{
    
    let searchOption={}
    if(req.query.name!=null && req.query.name!== '')
    {
       searchOption.name=new RegExp(req.query.name,'i')
    }

    let query=Book.find()
    const books= await query.exec()
    


    try{
         const authors= await Author.find(searchOption)
         res.render('authors/index',{
             authors :authors,
            searchOption: req.query,
            booked: books
        })
    }catch{
        res.redirect('/')
    }
})

router.get('/:id',async(req,res)=>{
    

    let query = Book.find()
    if(req.params.id!= null && req.params.id != ''){
        query=query.regex('author',new RegExp(req.params.id,'i'))
    }
    try{
        const books= await query.exec()
        res.render('authors/searchcat',{
            meh: books
         })
       }catch{
           res.redirect('/')
       }
    
 })



// creating author
router.post('/',async(req,res)=>{
    

    const author = new Author({
        name: req.body.name
    })


    try{
        const newAuthor= await author.save()  
        res.redirect('authors')

    }catch{
        res.render('authors/new',{
            errorMessage: 'Error Creating Author'
        })
    }
})

module.exports=router