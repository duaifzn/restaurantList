const express = require('express')
const router = express.Router()
const resList = require('../models/resList.js')

router.get('/', (req, res) => {
  resList.find((err, reslists) => {
    if (err) console.error(err)
    return res.render('index', { restaurant: reslists })
  })

  //res.send(`server is runing`)
})
router.get('/restaurants/:id', (req, res) => {
  console.log(req)
  resList.findById(req.params.id, (err, reslists) => {
    if (err) return console.error(err)
    return res.render('show', { restaurant: reslists })
  })
})
//create restaurant
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/restaurants/new', (req, res) => {
  const list = new resList({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })
  list.save(err => {
    if (err) console.error(err)
    return res.redirect('/')
  })
})
//edit display
router.get('/restaurants/:id/edit', (req, res) => {
  resList.findById(req.params.id, (err, reslists) => {
    if (err) return console.error(err)
    return res.render('edit', { restaurant: reslists })
  })
})
//edit
router.put('/restaurants/:id/edit', (req, res) => {
  resList.findById(req.params.id, (err, reslists) => {
    if (err) return console.error(err)
    console.log(req.body)
    reslists.name = req.body.name
    reslists.category = req.body.category
    reslists.location = req.body.location
    reslists.phone = req.body.phone
    reslists.description = req.body.description
    reslists.google_map = req.body.google_map
    reslists.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})
//delete
router.delete('/restaurants/:id/delete', (req, res) => {
  resList.findById(req.params.id, (err, reslists) => {
    if (err) return console.error(err)
    reslists.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

router.get('/search', (req, res) => {
  //搜尋的內容正規化
  const keyword = new RegExp(req.query.keyword)
  //const restaurant = resList.results.filter(hotel => hotel.name.toLowerCase().includes(req.query.keyword.toLowerCase()))
  resList.find({ name: keyword }, (err, reslists) => {
    if (err) return console.error(err)
    console.log(reslists)
    return res.render('index', { restaurant: reslists, keyword: req.query.keyword })
  })
  //res.render('index', { restaurant: restaurant, keyword: keyword })
})

module.exports = router