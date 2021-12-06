const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `3,4,3,1,2`

function part1(input, days) {
    let fish = input.split(',').map(i => +i)

    for (let i=0; i<days; i++) {
        const newFish = []

        fish.forEach((num) => {
            if (num === 0) {
                newFish.push(6)
                newFish.push(8)
            } else {
                newFish.push(num - 1)
            }
        })
        fish = newFish
    }
    return fish.length
}


function part2(input, days) {
    let fish = input.split(',').map(i => +i)

    const counts = {}
    for (let i=0; i<=8; i++) {
        counts[`_${i}`] = 0
    }

    fish.forEach((num) => {
        counts[`_${num}`]++
    })

    for (let i=0; i<days; i++) {
        const aboutToCreate = counts[`_0`]
        counts[`_0`] = counts[`_1`]
        counts[`_1`] = counts[`_2`]
        counts[`_2`] = counts[`_3`]
        counts[`_3`] = counts[`_4`]
        counts[`_4`] = counts[`_5`]
        counts[`_5`] = counts[`_6`]
        counts[`_6`] = counts[`_7`]
        counts[`_7`] = counts[`_8`]
        counts[`_6`] += aboutToCreate
        counts[`_8`] = aboutToCreate

    }
    return Object.values(counts).reduce((acc, count) => acc + count, 0)
}




console.log('-- test input')
console.log({ part1: part1(testInput, 80) })
console.log({ part2: part2(testInput, 256) })

console.log('-- real input')
console.log({ part1: part1(realInput, 80) })
console.log({ part2: part2(realInput, 256) })