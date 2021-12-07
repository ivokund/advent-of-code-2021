const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `16,1,2,0,4,2,7,1,2,14`

function part1(input) {
    const positions = input.split(',').map((i) => +i)
    const costs = positions.map((position) => {
        const fuelCost = positions.reduce((sum, pos) => {
            return sum + Math.abs(Math.abs(pos) - Math.abs(position))
        }, 0)

        return [position, fuelCost]
    })

    costs.sort((a, b) => a[1] - b[1])
    return costs.shift()[1]
}


function part2(input) {
    const positions = input.split(',').map((i) => +i)
    const posMin = Math.min(...positions)
    const posMax = Math.max(...positions)
    let potentialPositions = []
    for (let i=posMin; i<=posMax; i++) {
        potentialPositions.push(i)
    }

    const getMoveCost = (from, to) => {
        const delta = (Math.abs(Math.abs(from) - Math.abs(to)))
        let sum = 0
        for (let i=1; i<=delta; i++) {
            sum += i
        }
        return sum
    }

    const costs = potentialPositions.map((position) => {
        const fuelCost = positions.reduce((sum, pos) => {
            return sum + getMoveCost(pos, position)
        }, 0)

        return [position, fuelCost]
    })

    costs.sort((a, b) => a[1] - b[1])
    return costs.shift()[1]

}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })