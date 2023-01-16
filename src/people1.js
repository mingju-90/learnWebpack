const people = require('./people.js')


const age = 13

const add = () => age++

export default {
    age,
    add
}

exports.add = add
exports.age = age
