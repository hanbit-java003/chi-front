var _ = require('lodash');

var stack = [];
var top = 0;

function stackPush(layer, index) {
    stack.push(layer[index]);
    console.log(stack);
    top++;
    return top;
}


module.exports = {
    stackPush: stackPush
};