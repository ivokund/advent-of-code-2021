const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')
const { FibonacciHeap } = require('@tyriar/fibonacci-heap/lib/fibonacciHeap');

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
    const finishIndex = `${rows.length-1},${rows[0].length-1}`
    const startIndex = '0,0'

    const getWeight = (strIndex) => {
        const [r, c] = strIndex.split(',')
        return rows[r]?.[c]
    }

    const adjList = rows.reduce((adjList, row, rowNo) => {
        row.forEach((score, colNo) => {
            const index = `${rowNo},${colNo}`
            if (!adjList[index]) { adjList[index] = [] }

            [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([deltaRow, deltaCol]) => {
                const toIndex = `${rowNo+deltaRow},${colNo+deltaCol}`
                const weight = getWeight(toIndex)
                if (weight) {
                    adjList[index].push([toIndex, weight])
                }
            })
        })
        return adjList
    }, {})

    const allNodeIds = Object.keys(adjList)
    const distances = allNodeIds.reduce((acc, nodeId) => {
        acc[nodeId] = nodeId === startIndex ? 0 : Infinity;
        return acc;
    }, {});

    const unvisitedHeap = new FibonacciHeap()

    const unvisited = allNodeIds.reduce((acc, nodeId) => {
        acc[nodeId] = unvisitedHeap.insert(distances[nodeId], nodeId)
        return acc
    }, {})

    let currentNode = unvisited[startIndex]

    while (currentNode) {
        adjList[currentNode.value].forEach(([nodeId, weight]) => {
            if (unvisited[nodeId]) {
                const tentativeWeight = distances[currentNode.value] + weight
                if (tentativeWeight < distances[nodeId]) {
                    distances[nodeId] = tentativeWeight
                    unvisitedHeap.decreaseKey(unvisited[nodeId], tentativeWeight)
                }
            }
        })
        delete unvisited[currentNode.value]

        if (currentNode.value === finishIndex) {
            // end node reached
            break
        }
        currentNode = unvisitedHeap.extractMinimum()
    }

    return currentNode.key
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
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })