const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const resList = require('./restaurant.json')
//add a template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
//set template engine
app.set('view engine', 'handlebars')
//set static file
app.use(express.static('public'))


app.get('/',(req,res)=>{
    res.render('index',{restaurant: resList.results})
    //res.send(`server is runing`)
})
app.get('/restaurants/:id',(req,res)=>{
    //console.log(req)
    const restaurant = resList.results.find(hotel => hotel.id === Number(req.params.id))
    res.render('show',{restaurant: restaurant})
})

app.get('/search',(req,res)=>{
    //console.log(req.query.keyword)
    const keyword = req.query.keyword
    const restaurant = resList.results.filter(hotel => hotel.name.toLowerCase().includes(req.query.keyword.toLowerCase()))
    res.render('index',{restaurant: restaurant, keyword: keyword})
})



//start and listen server
app.listen(port,()=>{
    console.log(`Express is listening on localhost:${port}`)
})