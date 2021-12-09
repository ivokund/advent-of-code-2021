const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `2199943210
3987894921
9856789892
8767896789
9899965678`


const parseRows = (input) => {
    return input.split('\n').map((row) => {
        return row.split('').filter((r) => r).map((n) => +n)
    })
}

const getLowPoints = (input) => {
    const getNeighbours = (rows, row, col) => {
        const getCoord = (row, col) => {
            return rows?.[row]?.[col]
        }
        let neighbours = []
        if (getCoord(row, col+1) !== undefined) {
            neighbours.push(getCoord(row, col+1))
        }
        if (getCoord(row, col-1) !== undefined) {
            neighbours.push(getCoord(row, col-1))
        }
        if (getCoord(row + 1, col) !== undefined) {
            neighbours.push(getCoord(row + 1, col))
        }
        if (getCoord(row - 1, col) !== undefined) {
            neighbours.push(getCoord(row - 1, col))
        }
        return neighbours
    }

    const rows = parseRows(input)
    const lowPoints = []
    rows.forEach((row, rowNo) => {
        row.forEach((number, colNo) => {
            const neighbours = getNeighbours(rows, rowNo, colNo)
            if (number < Math.min(...neighbours)) {
                lowPoints.push([rowNo, colNo])
            }
        })
    })
    return lowPoints
}


function part1(input) {
    const rows = parseRows(input)
    return getLowPoints(input).reduce((sum, [rowNo, colNo]) => sum + rows[rowNo][colNo] + 1, 0)
}

function part2(input) {
    const rows = input.split('\n')

    const lowPoints = getLowPoints(input)
    const basins = lowPoints.map(([rowNo, colNo]) => {
        const index = `${rowNo},${colNo}`
        return {[index]: [rowNo, colNo]}
    })

    const anyBasinMap = lowPoints.reduce((acc, [rowNo, colNo]) => {
        const index = `${rowNo},${colNo}`
        return {...acc, [index]: [rowNo, colNo]}
    }, {})

    const getNeighboursHigherThan = (rowNo, colNo, num) => {
        const shifts = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        const ret = []
        shifts.forEach(([dx, dy]) => {
            if (rows[rowNo + dx]?.[colNo + dy] !== undefined) {
                const value = rows[rowNo + dx]?.[colNo + dy]
                if (value > num && value < 9) {
                    ret.push([rowNo + dx, colNo + dy])
                }
            }
        })
        return ret
    }

    // expand basins
    basins.forEach((basinMap) => {
        let added = 1
        while (added > 0) {
            added = 0
            Object.values(basinMap).forEach(([rowNo, colNo]) => {
                const highNeighbours = getNeighboursHigherThan(rowNo, colNo, rows[rowNo][colNo])
                highNeighbours.forEach(([nRow, nCol]) => {
                    const index = `${nRow},${nCol}`
                    if (!anyBasinMap[index]) {
                        basinMap[index] = [nRow, nCol]
                        anyBasinMap[index] = [nRow, nCol]
                        added++
                    }
                })
            })
        }
    })

    const sizes = basins.map((basinMap) => {
        return Object.keys(basinMap).length
    }).sort((a, b) => a - b)

    const last3 = sizes.splice(-3)
    return last3.reduce((acc, item) => acc * item, 1)
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })