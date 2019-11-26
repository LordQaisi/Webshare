let routes = require('./routes');
let express = require('express');
let path = require('path');
let exphbs = require('express-handlebars');
let morgan = require('morgan');
let favicon = require('serve-favicon');
let multer = require('multer');
let bodyParser =require('body-parser');
let moment = require('moment');
let expressValidator = require('express-validator');
let session = require('express-session');
let flash = require('express-flash');
let passport = require('passport');
let setuppassport = require('./setuppassport');
let methodOverride = require('method-override');

module.exports = function(app){
    app.use(favicon(path.join(__dirname, '../public','images', 'favicon.ico')));

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());  //deals directly with the forms on the site
    app.use(methodOverride('_method'));
    app.use(expressValidator());
    app.use(multer({dest:'./public/upload/temp'}).single('file'));
    app.use(session({
                    secret:'yki^zj2:*7',
                    resave:false,
                    saveUninitialized:false
                    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    setuppassport();
    app.use('/public/', express.static(path.join(__dirname, '../public/')));
    routes(app);

    app.engine('handlebars', exphbs.create({
        'defaultlayout':'main',
        'layoutsDir':app.get('views') + '/layouts',
        'partialsDir':app.get('views') + '/partials',
        'helpers':{
            'table':function(data){
                var str = '<table class ="table table-bordered">';
                for(i=0; i < data.length; i++){
                    str += '<tr>'
                        for(val in data[i]){
                            str += '<td>' + data[i][val] + '</td>';
                        }
                    str += '</tr>'
                }
                str += '</table>';
    
                return str;
            },
            'timeago':function(timestamp){
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine);
    app.set('view engine', 'handlebars');
    
    return app;
}


