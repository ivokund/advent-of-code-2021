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

function part1(input) {
    const [algoStr, imageStr] = input.split('\n\n')

    const algo = algoStr.replace(/\s/g, '')
    const image = imageStr.split('\n').map((line) => line.split(''))

    const draw = (img) => console.log(img.map((line) => line.join('')).join('\n') + '\n')

    const getPaddings = (image) => {
        let top = 0
        let right = 0
        let bottom = 0
        let left = 0

        for (let y=0; y<image.length-1; y++) {
            if (image[y].join('').indexOf('#') === -1) {
                top++
            } else {
                break
            }
        }
        for (let y=image.length-1; y>=0; y--) {
            if (image[y].join('').indexOf('#') === -1) {
                bottom++
            } else {
                break
            }
        }
        const width = image[0].length
        for (let x=0; x<width; x++) {
            if (image.map((line) => line[x]).join('').indexOf('#') === -1) {
                left++
            } else { break }
        }
        for (let x=width-1; x>=0; x--) {
            if (image.map((line) => line[x]).join('').indexOf('#') === -1) {
                right++
            } else { break }
        }
        return [top, bottom, left, right]
    }

    let background = '.'

    const apply = (image, algo) => {
        console.log('beginning of loop:')
        draw(image)
        const width = image[0].length

        const height = image.length
        const [padTop, padBottom, padLeft, padRight] = getPaddings(image)

        const xPadding = 3
        const yPadding = 3
        const topPaddingToAdd = Math.max(yPadding - padTop, 0)
        const bottomPaddingToAdd = Math.max(yPadding - padBottom, 0)
        const leftPaddingToAdd = Math.max(xPadding - padLeft, 0)
        const rightPaddingToAdd = Math.max(xPadding - padRight, 0)
        // console.log({padTop, padBottom, padLeft, padRight, xPadding, yPadding})

        // console.log({topPaddingToAdd})

        const newImage = []
        for (let y = -topPaddingToAdd; y < height + bottomPaddingToAdd; y++) {
            const line = []
            for (let x = -leftPaddingToAdd; x < width + rightPaddingToAdd; x++) {
                line.push(image[y]?.[x] ?? background ?? image[0][0])
            }
            newImage.push(line)
        }

        background = null

        console.log('after adding padding:')
        draw(newImage)

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
                        char = background ?? image[0][0]
                    }
                    return acc + (char === '#' ? '1' : '0')
                }, '')

                const decimal = parseInt(binaryNum, 2)
                // console.log({ pT, pB, pL, pR })
                // console.log({rowNo, colNo, binaryNum})
                return algo.substr(decimal, 1)
            })
        })
        // background = background === '#' ? '.' : '#'
        return ret
    }

    let img = image
    // draw(img)

    for (let i=0; i<2; i++) {
        console.log(' ========= ')
        console.log(' ========= ')
        img = apply(img, algo)
        console.log('after loop:')
        draw(img)

    }


    const count = img.reduce((acc, lines) => {
        return acc + lines.filter((col) => col === '#').length
    }, 0)

    return count
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

// 34578
// 34972
// 34597
// 5224
// 5826
// 6283