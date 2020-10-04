const rectangle = require('./rectangle');
var rect = require('./rectangle');



function solveRec(l,b){
    console.log('solving for rectangle with l=' + l + ' and b=' + b + ':');
    
    rect(l,b, (err, rectangle) => {
        if(err){
            console.log("ERROR:" + err.message);
        }
        else{
            console.log("area = " + rectangle.area() );
            console.log("perimeter = " + rectangle.perimeter() );
        }
    });

    console.log("this line is after calling the rect() ");
}


solveRec(3,4);
console.log("\n");
solveRec(0,5);