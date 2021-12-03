const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`


const mostCommonBit = (rows, i) => {
    const oneCount = rows.filter((row) => row[i] === '1').length
    const zeroCount = rows.filter((row) => row[i] === '0').length

    return oneCount >= zeroCount ? '1' : '0'
}

function part1(input) {
    const rows = input.split('\n')
    let gamma = '', epsilon = ''
    for (let i=0; i<rows[0].length; i++) {
        const mcb = mostCommonBit(rows, i)
        gamma += mcb
        epsilon += mcb === '1' ? '0' : '1'
    }
    gamma = parseInt(gamma, 2)
    epsilon = parseInt(epsilon, 2)
    return gamma * epsilon
}


function part2(input) {
    const rows = input.split('\n')


    const filterStack = (stack, index, bitvalue) => {
        return stack.filter((row) => row[index] === bitvalue)
    }

    let stackOxygen = [...rows]
    let stackCo2 = [...rows]
    let index = 0
    while (stackOxygen.length > 1) {
        const mcb = mostCommonBit(stackOxygen, index)
        stackOxygen = filterStack(stackOxygen, index, mcb)
        index++
    }

    index = 0
    while (stackCo2.length > 1) {
        const lcb = mostCommonBit(stackCo2, index) === '1' ? '0' : '1'
        stackCo2 = filterStack(stackCo2, index, lcb)
        index++
    }

    const oxygenInt = parseInt(stackOxygen[0], 2)
    const co2Int = parseInt(stackCo2[0], 2)
    const result = oxygenInt * co2Int
    return result
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })