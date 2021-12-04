const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

// stolen from internets
Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function(chunkSize) {
        var array = this;
        return [].concat.apply([],
            array.map(function(elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }
});

const testInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`

const checkBoard = (boardMap, number) => {
    const list = Object.keys(boardMap)
    const chunks = list.chunk_inefficient(5)

    let found = false
    // rows
    chunks.forEach((row) => {
        const count = row.filter((num) => boardMap[num]).length
        if (count === 5) {
            // console.log('found match from rows', {row})
            found = true
        }
    })

    const getColumn = (chunks, index) => chunks.map((row) => row[index])

    for (let i=0; i<5; i++) {
        const column = getColumn(chunks, i);
        const count = column.filter((num) => boardMap[num]).length
        if (count === 5) {
            // console.log('found match from columns', {column})
            found = true
        }
    }

    if (found === true) {
        const unmarked = Object.entries(boardMap).filter(([k, v]) => !v)
            .reduce((acc, [k]) => {
                return acc + Number(k.substring(1))
            }, 0)
        return unmarked * number
    }
}

function part1(input) {
    const rows = input.split('\n\n')
    const [numbersRow, ...boardRows] = rows
    const numbers = numbersRow.split(',')

    const boards = boardRows.map((row) => {
        return row.split(/[\s+\n]/).filter(i => i)
    })

    const boardMaps = boards.map((boardNumbers) => {
        return boardNumbers.reduce((acc, num) => ({...acc, [`_${num}`]: false}), {})
    })

    try {
        numbers.forEach((number) => {
            boardMaps.forEach((board, boardNo) => {
                if (board[`_${number}`] !== undefined) {
                    board[`_${number}`] = true
                }
                const result = checkBoard(board, number)
                if (result !== undefined) {
                    throw result
                }
            })
        })
    } catch (result) {
        return result
    }
}


function part2(input) {
    const rows = input.split('\n\n')
    const [numbersRow, ...boardRows] = rows
    const numbers = numbersRow.split(',')

    const boards = boardRows.map((row) => {
        return row.split(/[\s+\n]/).filter(i => i)
    })

    const boardMaps = boards.map((boardNumbers) => {
        return boardNumbers.reduce((acc, num) => ({...acc, [`_${num}`]: false}), {})
    })


    const wonBoards = []
    try {
        numbers.forEach((number, boardIndex) => {
            boardMaps.forEach((board, boardNo) => {
                if (wonBoards.find(([el]) => el === boardNo)) {
                    return
                }
                if (board[`_${number}`] !== undefined) {
                    board[`_${number}`] = true
                }
                const result = checkBoard(board, number)
                if (result !== undefined) {
                    wonBoards.push([boardNo, result])
                }
            })
        })

        const [, lastResult] = wonBoards.pop()
        return lastResult
    } catch (result) {
        return result
    }

}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })