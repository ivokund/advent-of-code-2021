const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`

function part1(input) {
    const rows = input.split('\n').map((line) => line.split(''))

    const height = rows.length
    const width = rows[0].length

    const eastQueue = []
    const southQueue = []

    const config = {
        '>': { transform: [1, 0], queue: eastQueue },
        'v': { transform: [0, 1], queue: southQueue },
    }

    const getNextCoords = ([x, y]) => {
        const transform = config[rows[y][x]].transform

        const newCoords = [x + transform[0], y + transform[1]]
        if (newCoords[0] === width) {
            newCoords[0] = 0
        }
        if (newCoords[1] === height) {
            newCoords[1] = 0
        }
        return newCoords
    }

    const canMove = ([x, y]) => {
        const [nextX, nextY] = getNextCoords([x, y])
        return rows[nextY][nextX] === '.'
    }

    const draw = (matrix) => {
        console.log(matrix.map((line) => line.join('')).join('\n'))
    }

    let finished = false
    let steps = 0
    const doMove = () => {
        steps++
        let moveCount = 0

        for (let [char, {queue}] of Object.entries(config)) {
            for (let y=0; y<height; y++) {
                for (let x=0; x<width; x++) {
                    const value = rows[y][x]
                    if (value === char && canMove([x, y])) {
                        config[value].queue.push([x, y])
                    }
                }
            }
            while (queue.length > 0) {
                moveCount++
                const [x, y] = queue.pop()
                const [newX, newY] = getNextCoords([x, y])
                const char = rows[y][x]
                rows[y][x] = '.'
                rows[newY][newX] = char
            }
        }

        finished = moveCount === 0
    }

    while (!finished) {
        doMove()
        // draw(rows)
    }
    return steps

}


function part2(input) {
    const rows = input.split('\n')

}

console.log('-- test input')
console.log({ part1: part1(testInput) })
// console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
// console.log({ part2: part2(realInput) })