const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')

const exphbs = require('express-handlebars')
//const resList = require('./restaurant.json')
//add a template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
//set template engine
app.set('view engine', 'handlebars')
//set static file
app.use(express.static('public'))
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
    // console.log(req)
    resList.find({ id: req.params.id }, (err, reslists) => {
        if (err) return console.error(err)
        //console.log(reslists.name)
        return res.render('show', { restaurant: reslists[0] })
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