const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`

function part1(input, steps) {
    let rows = input.split('\n').map((row) => row.split(''))

    const forEvery = (fn) => {
        const len = rows.length
        for (let rowId=0; rowId<len; rowId++) {
            for (let colId=0; colId<len; colId++) {
                fn(rowId, colId)
            }
        }
    }

    let flashCount = 0

    const getCoordsThatWillFlash = (alreadyFlashed) => {
        const flashingCoords = []
        forEvery((rowId, colId) => {
            const index = `${rowId},${colId}`
            if (rows[rowId][colId] > 9 && !alreadyFlashed[index]) {
                flashingCoords.push([rowId, colId])
            }
        })
        return flashingCoords
    }

    if (steps === null) {
        steps = Number.MAX_SAFE_INTEGER
    }

    for (let step=1; step<=steps; step++) {
        // increase all by 1
        forEvery((rowId, colId) => rows[rowId][colId]++)
        let flashedThisStep = {}

        const toBeFlashed = getCoordsThatWillFlash(flashedThisStep)

        while (toBeFlashed.length > 0) {
            const nextFlash = toBeFlashed.shift()
            const index = nextFlash.join(',')

            // increase adjacent
            forEvery((rowId, colId) => {
                if (Math.abs(rowId - nextFlash[0]) <= 1 && Math.abs(colId - nextFlash[1]) <= 1) {
                    rows[rowId][colId]++
                }
            })

            flashCount++
            flashedThisStep[index] = nextFlash

            const newToBeFlashed = getCoordsThatWillFlash(flashedThisStep)
            newToBeFlashed.forEach(([rowId, colId]) => {
                if (!toBeFlashed.find(([row, col]) => row === rowId && col === colId)) {
                    toBeFlashed.push([rowId, colId])
                }
            })
        }

        Object.values(flashedThisStep).forEach(([x, y]) => {
            rows[x][y] = 0
        })

        if (Object.keys(flashedThisStep).length === Math.pow(rows[0].length, 2)) {
            return step
        }
    }
    return flashCount
}

console.log('-- test input')
console.log({ part1: part1(testInput, 100) })
console.log({ part2: part1(testInput, null) })

console.log('-- real input')
console.log({ part1: part1(realInput, 100) })
console.log({ part2: part1(realInput, null) })