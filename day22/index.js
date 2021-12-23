const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`

function calculate(input, limit) {
    const instructions = input.split('\n').map((line) => {
        const matches = /(on|off) x=([\-\d]+)\.\.([\-\d]+),y=([\-\d]+)\.\.([\-\d]+),z=([\-\d]+)\.\.([\-\d]+)/.exec(line)
        return [
            matches[1] === 'on',
            [+matches[2], +matches[3]],
            [+matches[4], +matches[5]],
            [+matches[6], +matches[7]],
        ]
    })

    const onCubes = {}

    for (let [flag, xRange, yRange, zRange] of instructions) {
        if (limit !== null && (Math.min(xRange[0], yRange[0], zRange[0]) < -limit || Math.max(xRange[1], yRange[1], zRange[1]) > limit)) {
            continue
        }
        for (let x=xRange[0]; x<=xRange[1]; x++) {
            for (let y=yRange[0]; y<=yRange[1]; y++) {
                for (let z=zRange[0]; z<=zRange[1]; z++) {
                    const index = `${x},${y},${z}`
                    if (!flag) {
                        delete onCubes[index]
                    } else {
                        onCubes[index] = true
                    }
                }
            }
        }
    }

    return Object.keys(onCubes).length
}


console.log('-- test input')
console.log({ part1: calculate(testInput, 50) })
// console.log({ part2: calculate(testInput, null) })

console.log('-- real input')
console.log({ part1: calculate(realInput, 50) })
// console.log({ part2: calculate(realInput) })