const express = require('express')
const app = express()

const bodyparser = require("body-parser");

app.use(express.static(__dirname + '/public'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(bodyparser.json());
var urlencodedParser = bodyparser.urlencoded({
    extended: false
})
var mongojs = require('mongojs')
var db = mongojs('calendar', ['calendar'])

// app.get('/', (req, res) => res.send('Hello World!'))

app.get('/calendar', function (req, res) {
    console.log('I received a GET request');
    db.calendar.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

app.post('/calendar', function (req, res) {
    req.body.cost = parseInt(req.body.cost);
  
    console.log(req.body);
    db.calendar.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});
app.delete('/calendar/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.calendar.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    });
});
app.get('/calendar/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.calendar.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/calendar/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.date);
    db.calendar.findAndModify({
        query: { _id: mongojs.ObjectId(id) },
        update: { $set: { date: req.body.date, name: req.body.name, cost: req.body.cost } },
        new: true
    }, function (err, doc) {
        res.json(doc);
    }
    );
});

app.get('/totalCost', urlencodedParser, function(req, res, next) {
  db.calendar.aggregate({
    $group: {
      _id: '',
      cost: { $sum: "$cost" }
    }

  },{
   $project: {
       _id: 0,
       cost: 1
   }
}
).toArray(function(err,docs){
    if(err) throw err;
    console.log("juhu " + docs[0].cost)
    res.json(docs[0].cost)
  })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
