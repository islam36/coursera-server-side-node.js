var rect = require('./rectangle');



function solveRec(l,b){
    console.log('solving for rectangle with l=' + l + ' and b=' + b + ':');
    
    if (l <= 0 || b <= 0){
        console.log('rectangle dimensions should be > 0');
    }
    else{
        console.log('area = '+ rect.area(l,b));
        console.log('permeter = ' + rect.perimeter(l,b));
    }
}


solveRec(3,4);
solveRec(0,5);