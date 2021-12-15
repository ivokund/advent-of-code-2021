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
        const path = [current, toCoords,]
        stack.push({path, score: getRisk(toCoords)})
    })


    const lowestScoresToCoords = {}
    let i=0
    while (stack.length > 0) {
        i++
        if (i % 100000 === 0) {
            console.log({i, len: stack.length, lowest: lowestScoresToCoords[finishIndex]})
        }
        const { path, score } = stack.pop()
        for (let toCoords of getPossiblePaths(path[path.length - 1])) {
            const coordIndex = toCoords.join()
            const newScore = getRisk(toCoords) + score
            if (lowestScoresToCoords[coordIndex] === undefined || newScore < lowestScoresToCoords[coordIndex]) {
                // console.log(`Found better score for ${coordIndex}: ${newScore} (before ${lowestScoresToCoords[coordIndex]})`)
                lowestScoresToCoords[coordIndex] = newScore
                stack.push({
                    path: [...path, toCoords],
                    score: newScore
                })
            }
        }
    }

    return lowestScoresToCoords[finishIndex]

}


function part2(input) {
    const rows = input.split('\n')

}

console.log('-- test input')
// console.log({ part1: part1(testInput) })
// console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
// console.log({ part2: part2(realInput) })