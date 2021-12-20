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

    const draw = (img) => console.log(img.map((line) => line.join('')).join('\n') + '\n')
    let bgColor = null


    const getPaddings = (image) => {
        const char = bgColor === '.' ? '#' : '.'
        let top = 0
        let right = 0
        let bottom = 0
        let left = 0

        for (let y=0; y<image.length-1; y++) {
            if (image[y].join('').indexOf(char) === -1) {
                top++
            } else {
                break
            }
        }
        for (let y=image.length-1; y>=0; y--) {
            if (image[y].join('').indexOf(char) === -1) {
                bottom++
            } else {
                break
            }
        }
        const width = image[0].length
        for (let x=0; x<width; x++) {
            if (image.map((line) => line[x]).join('').indexOf(char) === -1) {
                left++
            } else { break }
        }
        for (let x=width-1; x>=0; x--) {
            if (image.map((line) => line[x]).join('').indexOf(char) === -1) {
                right++
            } else { break }
        }
        return [top, bottom, left, right]
    }


    const apply = (image, algo) => {
        const width = image[0].length
        const height = image.length
        const [padTop, padBottom, padLeft, padRight] = getPaddings(image)

        const xPadding = 3
        const yPadding = 3
        const topPaddingToAdd = Math.max(yPadding - padTop, 0)
        const bottomPaddingToAdd = Math.max(yPadding - padBottom, 0)
        const leftPaddingToAdd = Math.max(xPadding - padLeft, 0)
        const rightPaddingToAdd = Math.max(xPadding - padRight, 0)

        const newImage = []
        for (let y = -topPaddingToAdd; y < height + bottomPaddingToAdd; y++) {
            const line = []
            for (let x = -leftPaddingToAdd; x < width + rightPaddingToAdd; x++) {
                line.push(image[y]?.[x] ?? bgColor ?? '.')
            }
            newImage.push(line)
        }

        const ret = newImage.map((line, rowNo) => {
            return line.map((pixel, colNo) => {
                const binaryNum = [
                    [-1, -1],
                    [-1, 0],
                    [-1, 1],
                    [0, -1],
                    [0, 0],
                    [0, 1],
                    [1, -1],
                    [1, 0],
                    [1, 1]
                ].reduce((acc, [dr, dc]) => {
                    let char = newImage[rowNo + dr]?.[colNo + dc]
                    if (!char) {
                        // console.log(`${rowNo + dr}x${colNo + dc} does not exist, using ${rowNo}x${colNo}: ${newImage[rowNo][colNo]}`)
                        char = bgColor ?? '.'
                    }
                    return acc + (char === '#' ? '1' : '0')
                }, '')

                const decimal = parseInt(binaryNum, 2)
                return algo.substr(decimal, 1)
            })
        })
        bgColor = algo.substr(parseInt((newImage[0][0] === '#' ? '1' : '0').repeat(9), 2),1 )
        return ret
    }

    let img = image

    for (let i=0; i<iterations; i++) {
        img = apply(img, algo)
    }
    draw(img)

    return img.reduce((acc, lines) => {
        return acc + lines.filter((col) => col === '#').length
    }, 0)
}



console.log('-- test input')
console.log({ part1: part1(testInput, 2) })
console.log({ part2: part1(testInput, 50) })

console.log('-- real input')
console.log({ part1: part1(realInput, 2) })
console.log({ part2: part1(realInput, 50) })
