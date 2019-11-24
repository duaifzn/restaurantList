const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
//const resList = require('./restaurant.json')
//add a template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
//set template engine
app.set('view engine', 'handlebars')
//set static file
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

//connect mongodb
mongoose.connect('mongodb://localhost/resList', { useNewUrlParser: true, useUnifiedTopology: true })
//return 'connection' when connect mongodb
const db = mongoose.connection
//set db status
db.on('error', () => {
    console.log('connect error')
})
db.once('open', () => {
    console.log('mongodb connected')
})

const resList = require('./models/resList.js')

app.get('/', (req, res) => {
    resList.find((err, reslists) => {
        if (err) console.error(err)
        return res.render('index', { restaurant: reslists })
    })

    //res.send(`server is runing`)
})
app.get('/restaurants/:id', (req, res) => {
    console.log(req)
    resList.findById(req.params.id, (err, reslists) => {
        if (err) return console.error(err)
        return res.render('show', { restaurant: reslists })
    })
})
//create restaurant
app.get('/new', (req, res) => {
    res.render('new')
})
app.post('/restaurants/new', (req, res) => {
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
app.get('/restaurants/:id/edit', (req, res) => {
    resList.findById(req.params.id, (err, reslists) => {
        if (err) return console.error(err)
        return res.render('edit', { restaurant: reslists })
    })
})
//edit
app.post('/restaurants/:id/edit', (req, res) => {
    resList.findById(req.params.id, (err, reslists) => {
        if (err) return console.error(err)
        console.log(req.body)
        reslists.id = req.params.id
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
app.post('/restaurants/:id/delete', (req, res) => {
    resList.findById(req.params.id, (err, reslists) => {
        if (err) return console.error(err)
        reslists.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

app.get('/search', (req, res) => {
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



//start and listen server
app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})