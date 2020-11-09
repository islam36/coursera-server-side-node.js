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
    Favorites.findOne({ user: req.user._id }, (err, favorite) => {
        if(err) return next(err);

        if(!favorite) {
            Favorites.create({ user: req.user._id })
            .then( (favorite) => {
                for(var i = 0; i < req.body.length ; i++) {
                    if(favorite.dishes.indexOf(req.body[i]._id) < 0) {
                        favorite.dishes.push(req.body[i]);
                    }
                }

                favorite.save()
                .then( (favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then( (favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch( (err) => next(err) );  
                })
                .catch( (err) => next(err) );
            })
            .catch( (err) => next(err) );
        }
        else {
            for (var i = 0; i < req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id) < 0) {
                    favorite.dishes.push(req.body[i]);
                }
            }

            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
    })
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

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then( (favorites) => {
        if(!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ "exists": false, "favorites": favorites });
        }
        else {
            if(favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({ "exists": false, "favorites": favorites });
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({ "exists": true, "favorites": favorites }); 
            }
        }
    }, (err) => next(err) )
    .catch( (err) => next(err) );
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then( (favorites) => {
        if(favorites != null){
            if(favorites.dishes.indexOf(req.params.dishId) < 0) {
                favorites.dishes.push(req.params.dishId);
            }

            favorites.save()
            .then( (favorites) => {
                Favorites.findById(favorites._id)
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                })
                .catch( (err) => next(err) );
                
            }, (err) => next(err) )
            .catch( (err) => next(err) );
        }
        else {
            Favorites.create({ user: req.user._id })
            .then( (favorites) => {
                favorites.dishes.push({ "_id": req.params.dishId });
                favorites.save()
                .then((favorites) => {
                    Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    })
                })
                .catch( (err) => next(err) );
                
            })
            .catch( (err) => next(err) );
        }
    })
})


.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain')
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);
})



.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then( (favorites) => {
        if(favorites != null) {
            if(favorites.dishes.indexOf(req.params.dishId) >= 0 ) {
                favorites.dishes.splice(favorites.dishes.indexOf(req.params.dishId), 1);
            }

            favorites.save()
            .then( (favorites) => {
                Favorites.findById(favorites._id)
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                })
                .catch( (err) => next(err) );        
            })
            .catch( (err) => next(err) );
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Dish ' + req.params.dishId + ' not found in your list of favorites!');
        }
    })
    .catch( (err) => next(err) );
});



module.exports = favoriteRouter;