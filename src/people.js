const people = import('./people1.js')
people.then(data => {
    console.log('data', data)
    age = data.age
})

const age = 11

const add = () => age++

export default {
    age,
    add
}

export {
    age,
    add
}
