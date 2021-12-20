const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`

function part1(input, iterations) {
    const [algoStr, imageStr] = input.split('\n\n')

    const algo = algoStr.replace(/\s/g, '')
    const image = imageStr.split('\n').map((line) => line.split(''))

    const neighbours = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 0], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]
    let bgColor = null

    const apply = (image, algo) => {
        const newImage = []
        for (let y = -2; y < image.length + 2; y++) {
            const line = []
            for (let x = -2; x < image[0].length + 2; x++) {
                line.push(image[y]?.[x] ?? bgColor ?? '.')
            }
            newImage.push(line)
        }

        const ret = newImage.map((line, rowNo) => {
            return line.map((pixel, colNo) => {
                const binaryNum = neighbours.reduce((acc, [dr, dc]) => {
                    let char = newImage[rowNo + dr]?.[colNo + dc] ?? bgColor ?? '.'
                    return acc + (char === '#' ? '1' : '0')
                }, '')
                return algo.substr(parseInt(binaryNum, 2), 1)
            })
        })
        bgColor = algo.substr(parseInt((newImage[0][0] === '#' ? '1' : '0').repeat(9), 2),1 )
        return ret
    }

    let img = image
    for (let i=0; i<iterations; i++) {
        img = apply(img, algo)
    }

    return img.reduce((acc, lines) => acc + lines.filter((col) => col === '#').length, 0)
}



console.log('-- test input')
console.log({ part1: part1(testInput, 2) })
console.log({ part2: part1(testInput, 50) })

console.log('-- real input')
console.log({ part1: part1(realInput, 2) })
console.log({ part2: part1(realInput, 50) })
