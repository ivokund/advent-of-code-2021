const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`

function part1(input) {
    const rows = input.split('\n').map((r) => r.split('').map((n) => +n))

    return calculate(rows)
}


function calculate(rows) {
    const rowMaxIndex = rows.length-1
    const colMaxIndex = rows[0].length - 1
    const finishIndex = `${rowMaxIndex},${colMaxIndex}`
    const current = [0, 0]

    const getRisk = ([rowNo, colNo]) => rows[rowNo][colNo]

    const getPossiblePaths = ([rowNo, colNo]) => {
        return  [[1, 0], [0, 1], [-1, 0], [0, -1]].reduce((acc, [dr, dc]) => {
            const newRowNo = rowNo + dr
            const newColNo = colNo + dc
            if (newRowNo >= 0 && newColNo >= 0 && newRowNo <= rowMaxIndex && newColNo <= colMaxIndex) {
                acc.push([newRowNo, newColNo])
            }
            return acc
        }, [])
    }

    // {path, score}
    const stack = []

    // add initial neighbours to the stack
    getPossiblePaths(current).forEach((toCoords) => {
        const path = [current, toCoords]
        // const visited = path.reduce((acc, [row, col]) => ({...acc, [`${row},${col}`]: true}))
        stack.push({
            path,
            score: getRisk(toCoords),
            // visited
        })
    })

    const lowestScoresToCoords = {}
    let winPath
    let i=0
    while (stack.length > 0) {
        i++
        if (i % 100000 === 0) {
            console.log({i, len: stack.length, lowest: lowestScoresToCoords[finishIndex]})
        }
        const { path, score } = stack.pop()
        const lastNodeCoords = path[path.length - 1]
        const prevToLastCoords = path[path.length - 2]
        for (let toCoords of getPossiblePaths(lastNodeCoords)) {
            const coordIndex = toCoords.join()

            // if (visited[coordIndex]) {
            //     continue
            // }
            const newScore = getRisk(toCoords) + score

            // don't go to where we just came from
            if (`${prevToLastCoords[0]},${prevToLastCoords[1]}` === coordIndex) {
                continue
            }
            if (coordIndex === finishIndex) {
                winPath = [...path, toCoords]
            }

            const minStepsToEnd = (colMaxIndex - toCoords[0]) + (rowMaxIndex - toCoords[1])
            const minScoreToFinish = newScore + minStepsToEnd
            // check if we already have a better final score than this score
            if (minScoreToFinish > lowestScoresToCoords[finishIndex]) {
                continue
            }

            if (lowestScoresToCoords[coordIndex] === undefined || newScore < lowestScoresToCoords[coordIndex]) {
                lowestScoresToCoords[coordIndex] = newScore
                // visited[`${toCoords[0]},${toCoords[1]}`] = true
                stack.unshift({
                    path: [...path, toCoords],
                    score: newScore,
                    // visited: visited
                })
            }
        }
    }

    return lowestScoresToCoords[finishIndex]
}


function part2(input) {
    const rowsOriginal = input.split('\n').map((r) => r.split('').map((n) => +n))

    const origLen = rowsOriginal[0].length

    const rowsV2 = rowsOriginal.map((row) => {
        const newRow = []
        let newNumbers = row
        for (let tileX = 0; tileX < 5; tileX++) {
            newRow.push(...newNumbers)
            newNumbers = newNumbers.map((i) => i + 1 > 9 ? 1 : i + 1)
        }
        return newRow
    })

    const rowsV3 = []
    for (let i=0; i<origLen * 5; i++) {
        let col = rowsV2.map((row) => row[i])

        for (let tileY = 0; tileY < 5; tileY++) {
            col.forEach((number, rowIndex) => {
                const newRowIndex = rowIndex + (tileY * origLen)
                if (!rowsV3[newRowIndex]) { rowsV3[newRowIndex] = []}
                rowsV3[newRowIndex][i] = number
            })
            col = col.map((i) => i + 1 > 9 ? 1 : i + 1)
        }
    }

    return calculate(rowsV3)
}

console.log('-- test input')
// console.log({ part1: part1(testInput) })
// console.log({ part2: part2(testInput) })

console.log('-- real input')
// console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })