const fs = require('fs')
const path = require('path')

const testInput = `199
200
208
210
200
207
240
269
260
263`

const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const calc = (rows) => {
    let increases = 0
    for (let i=0; i<rows.length; i++) {
        if (rows[i-1] && rows[i] > rows[i-1]) {
            increases++
        }
    }
    return increases
}
function part1(input) {
    const rows = input.split('\n').map((i) => +i)
    return calc(rows)
}

function part2(input) {
    const rows = input.split('\n').map((i) => +i)

    const windowSums = rows.map((value, i) => {
        if (rows[i+1] && rows[i+2]) {
            return value + rows[i+1] + rows[i+2]
        }
    }).filter((i) => !!i)
    return calc(windowSums)
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })
