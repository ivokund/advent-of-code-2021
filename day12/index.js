const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`

const calculate = (adjacencyList, allowTwice) => {
    const getPathsFrom = (from) => adjacencyList.reduce((acc, [f, t]) => {
        if (f === from) {
            acc.push([f, t])
        } else if (t === from) {
            acc.push([t, f])
        }
        return acc
    }, [])

    const stack = getPathsFrom('start')
    const allPaths = []
    while (stack.length > 0) {
        const path = stack.pop()
        if (path[path.length-1] === 'end') {
            allPaths.push(path)
        } else {
            const smallCharsInPath = path.filter((char) => char === char.toLowerCase())
            const allowedRepetitions = smallCharsInPath.reduce((acc, char) => {
                return {[char]: 1}
            }, {})

            if (allowTwice) {
                allowedRepetitions[allowTwice] = 2
            }
            const newPathsLeadingOut = getPathsFrom(path[path.length-1])
            const legalPathsLeadingOut = newPathsLeadingOut.filter(([f, t]) => {
                if (t.toUpperCase() === t) {
                    return true
                }
                const count = [...path, t].filter((n) => n === t).length
                return count <= (allowedRepetitions[t] || 1)
            })

            legalPathsLeadingOut.forEach(([from, to]) => {
                stack.push([...path, to])
            })
        }
    }
    return allPaths
}

function part1(input) {
    const adjacencyList = input.split('\n').map((l) => l.split('-'))
    return calculate(adjacencyList).length
}


function part2(input) {
    const adjacencyList = input.split('\n').map((l) => l.split('-'))
    const uniqueLcEdges = [...adjacencyList.reduce((set, [f, t]) => {
        set.add(f)
        set.add(t)
        return set
    }, new Set())].filter((v) => v.toLowerCase() === v && !['start', 'end'].includes(v))
    const paths = new Set()

    for (let edge of uniqueLcEdges) {
        calculate(adjacencyList, edge).forEach((pathList) => {
            paths.add(pathList.join(','))
        } )
    }

    return paths.size
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })