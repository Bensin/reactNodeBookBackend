import express from "express";
import request from 'request-promise';
import {parseString} from 'xml2js';
import authenticate from '../middleware/authenticate';
import Book from '../models/book';
import parseErrors from '../utils/parseErrors'

const router = express.Router();
router.use(authenticate);

router.get("/",(req, res) =>{
    Book.find({userId:req.currentUser._id}).then(book => res.json({book}));
});

router.post("/", (req, res) => {
    Book.create({ ...req.body.book, userId: req.currentUser._id })
      .then(book => res.json({ book }))
      .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
  });

router.get("/search",(req,res)=>{
    request.get(`https://www.goodreads.com/search/index.xml?key=3eVB8I5jKyv5Z847rNl7XQ&q=${req.query.q}`)
            .then(result =>
                 parseString(result,(err,goodreadResult) =>{
                    res.json({books:goodreadResult.GoodreadsResponse.search[0].results[0].work.map(work =>({
                        goodreadsId:work.best_book[0].id[0]._,
                        title:work.best_book[0].title[0],
                        authors:work.best_book[0].author[0].name[0],
                        covers:[
                            work.best_book[0].image_url[0]
                        ]
                    }))});
                }));
});

router.get("/fetchPages",(req,res)=>{
    const goodreadsId = req.query.goodreadsId;
    request.get(`https://www.goodreads.com/book/show.xml?key=3eVB8I5jKyv5Z847rNl7XQ&id=${goodreadsId}`)
            .then(result =>
                 parseString(result,(err,goodreadResult) =>{
                    const numPages = goodreadResult.GoodreadsResponse.book[0].num_pages[0];
                    const pages    = (numPages)? parseInt(numPages,10):0;
                    res.json({
                        pages
                    });
                }));
});

export default router;