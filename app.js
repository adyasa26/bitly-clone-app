const express = require('express')
const app = express()
const home = require('./home') // ./ artinya bahwa ini adalah file, jika tanpa ./ maka akan disebut fungsi
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
//const dash = require('./route/dash')

// set view engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout:'main'}))
app.set('view engine', 'handlebars')

// set body parser
app.use(bodyParser.urlencoded({
    extended : false
}))

app.use(express.static('public'))

app.use('/', home)
//app.use('/dash', dash)



app.listen(2000, () => console.log('Server run at port : 2000')) 