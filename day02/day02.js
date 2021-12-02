const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`

function part1(input) {
    const rows = input.split('\n')

    let coords = [0, 0] // h, d
    rows.forEach((line) => {

        const multipliers = {
            forward: [1, 0],
            down: [0, 1],
            up: [0, -1],
        }

        let [command, qty] = line.split(' ')
        const mult = multipliers[command]
        coords[0] += mult[0] * +qty
        coords[1] += mult[1] * +qty
    })

    return coords[0] * coords[1]
}


function part2(input) {
    const rows = input.split('\n')

    let coords = [0, 0, 0] // h, d, a
    rows.forEach((line) => {
        let [command, qty] = line.split(' ')
        const multipliers = {
            forward: [1, coords[2], 0],
            down: [0, 0, 1],
            up: [0, 0, -1],
        }[command]

        coords[0] += multipliers[0] * +qty
        coords[1] += multipliers[1] * +qty
        coords[2] += multipliers[2] * +qty
    })

    return coords[0] * coords[1]
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })