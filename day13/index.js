const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`

function part12(input) {
    const [coordsStr, foldsStr] = input.split('\n\n').map((s) => s.split('\n'))
    const coords = coordsStr.reduce((acc, str) => ({...acc, [str]: str.split(',').map((i) => +i)}), {})
    const folds = foldsStr.map((str) => str.substr(11).split('='))


    const fold = (map, axis, foldCoord) => {
        return Object.values(map).reduce((accMap, [x, y]) => {
            const set = (x, y) => { accMap[`${x},${y}`] = [x, y]}
            if (axis === 'y') {
                set(x, y < foldCoord ? y : foldCoord - (y - foldCoord))
            } else {
                set(x < foldCoord ? x : foldCoord - (x - foldCoord), y)
            }
            return accMap
        }, {})
    }

    const draw = (map) => {
        const maxX = Math.max(...Object.values(map).map((c) => c[0]))
        const maxY = Math.max(...Object.values(map).map((c) => c[1]))
        for (let y=0; y<=maxY; y++) {
            let line = ''
            for (let x= 0; x<=maxX; x++) {
                line += map[`${x},${y}`] !== undefined ? '#' : '.'
            }
            console.log(line)
        }
    }


    let part1 = fold(coords, folds[0][0], folds[0][1])
    console.log({part1: Object.keys(part1).length})

    let newCoords = {...coords}
    folds.forEach(([axis, coord], index) => {
        newCoords = fold(newCoords, axis, coord)
    })
    console.log('part2:')
    draw(newCoords)
}



console.log('-- test input')
part12(testInput)

console.log('-- real input')
part12(realInput)