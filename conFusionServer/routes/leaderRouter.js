const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); 
} )

.get( (req,res,next) => {
    res.end('will send all the leaders to you!');
})


.post( (req,res,next) => {
    res.end('will add the leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
})


.put( (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})


.delete( (req,res,next) => {
    res.end('deleting all the leaders!');
});




leaderRouter.route('/:leaderId')
.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); 
} )

.get( (req,res,next) => {
    res.end('will send the leader:' + req.params.leaderId);
})


.post( (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
})


.put( (req,res,next) => {
    res.end('updating leader:' + req.params.leaderId + '\n' + 
        'updated leader:' + req.body.name + ' with description: ' + req.body.description);
})


.delete( (req,res,next) => {
    res.end('deleting the leader:' + req.params.leaderId);
});



module.exports = leaderRouter;