const express = require('express');
const bodyParser = require('body-parser');
const authenticate =  require('../authenticate.js');
const cors = require('./cors.js');
const Favorites = require('../models/favorite.js');
const Dishes = require('../models/dishes.js');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Dishes.findOne({ user: req.user})
    .populate('user')
    .populate('dishes')
    .then( (favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);      
    }, (err) => next(err) )
    .catch( (err) => next(err) );
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(req.body != null) {
        Favorites.findOne({ user: req.user })
        .then( (favorites) => {
            if(favorites != null) {
                for(var i=0; i < req.body.dishes.length ; i++){
                    if(favorites.dishes.indexOf(req.body.dishes[i]) === -1)
                    favorites.dishes.push(req.body.dishes[i]);
                }

                favorites.save()
                .then( (favorites) => {
                    Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dishes')
                    .then( (favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
                }, (err) => next(err) )
                .catch( (err) => next(err) );
            }
            else {
                Favorites.create(req.body)
                .then( (favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err) )
                .catch( (err) => next(err) );
            }
        })
    }
})


.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({user: req.user})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    } , (err) =>  next(err) )
    .catch( (err) =>  next(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user })
    .then( (favorites) => {
        if(favorites != null){
            if(favorites.dishes.indexOf(req.params.dishId) === -1) {
                favorites.dishes.push(req.params.dishId);
            }

            favorites.save()
            .then( (favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err) )
            .catch( (err) => next(err) );
        }
        else {
            Favorites.create(req.params.dishId)
            .then( (favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err) )
            .catch( (err) => next(err) );
        }
    })
})



.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user})
    .then( (favorites) => {
        if(favorites != null) {
            if(favorites.dishes.indexOf(req.params.dishId) !== -1) {
                favorites.dishes.splice(favorites.dishes.indexOf(req.params.dishId), 1);
            }

            favorites.save()
            .then( (favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err) )
            .catch( (err) => next(err) );
        }
    }, (err) => next(err) )
    .catch( (err) => next(err) );
});



module.exports = favoriteRouter;