const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

function part1(input) {
    const rows = input.split('\n').map((line) => {
        return line.split(' -> ').map((coords) => coords.split(',').map((i) => +i))
    })

    const filteredCoords = rows.filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2)

    const coordMap = filteredCoords.reduce((acc, [[x1, y1], [x2, y2]]) => {
        const xMin = Math.min(x1, x2)
        const xMax = Math.max(x1, x2)
        const yMin = Math.min(y1, y2)
        const yMax = Math.max(y1, y2)
        for (let x = xMin; x <= xMax; x++) {
            for (let y = yMin; y <= yMax; y++) {
                const coordString = `${x},${y}`
                if (!acc[coordString]) {
                    acc[coordString] = 0
                }
                acc[coordString]++
            }
        }
        return acc
    }, {})
    return Object.values(coordMap).filter((count) => count >= 2).length
}


function part2(input) {
    const rows = input.split('\n').map((line) => {
        return line.split(' -> ').map((coords) => coords.split(',').map((i) => +i))
    })

    const coordMap = rows.reduce((acc, [[x1, y1], [x2, y2]]) => {
        const xOp = x1 > x2 ? -1 : 1
        const yOp = y1 > y2 ? -1 : 1

        const xLen = Math.abs(x1 - x2)
        const yLen = Math.abs(y1 - y2)

        let x = x1
        let y = y1
        const maxLen = Math.max(xLen, yLen)
        for (let i = 0; i <= maxLen; i++) {
            const coordString = `${x},${y}`
            if (!acc[coordString]) {
                acc[coordString] = 0
            }
            acc[coordString]++
            if (xLen > 0) {
                x = x + xOp
            }
            if (yLen > 0) {
                y = y + yOp
            }
        }
        return acc
    }, {})
    return Object.values(coordMap).filter((count) => count >= 2).length


}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })