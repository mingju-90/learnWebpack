const people = import('./people.js')
const people1 = import('./people1.js')

people.then(data => {

    console.log(data.age)
    console.log(data)
    console.log(data.age)
})