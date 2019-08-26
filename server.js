const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
var db;

MongoClient.connect('mongodb://localhost:27017/examen', { useNewUrlParser: true }, (err, database) => {
    if (err) return console.log(err)
    db = database.db('examen')

    app.listen(process.env.PORT || 3000, () => {
        console.log('Listening on port 3000')
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect('/list')
})
app.get('/list', (req, res) => {
    var sort1 = { datum_vaststelling: 1 };
    var sort2 = { opnameplaats_straat: 1 };
    db.collection('overtredingen').find().sort(sort1).sort(sort2).toArray((err, result) => {
        if (err) return console.log(err)
            res.render('list.ejs', { inhaal: result })
    })
})

app.get('/overtreding', (req, res) => {
    res.render('opnameplaats.ejs', { product: '' })
})
app.post('/search', (req, res) => {
    var query = { name: req.body.name }
    db.collection('overtredingen').find(query).toArray(function (err, result) {
        if (err) return console.log(err)
        res.render('search_result.ejs', { inhaal: result })
        //console.log(result);
    })
})

app.get('/snelheid', (req, res) => {
    res.render('snelheid.ejs', { product: '' })
})
app.post('/search', (req, res) => {
    var query = { int: req.body.int }
    var lijst = []
    db.collection('overtredingen').find(query).toArray(function (err, result) {
        if (err) return console.log(err)
        foreach(string c in result){
            if (c.aantal_overtredingen_snelheid >= query){
                lijst.push(c);
            }
        };
        res.render('search_result.ejs', { inhaal: lijst })
        //console.log(result);
    })
})
