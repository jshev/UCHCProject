var express = require('express');
var app = express();
var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index', {title:"Main"});
});

app.listen(3000);
console.log('Listening to port 3000');
