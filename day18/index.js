const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`

class SnailfishNumber {
    firstRegularToLeft = null
    firstRegularToRight = null

    constructor (value) {
        this.value = value instanceof SnailfishNumber ? value.getValue() : value
    }
    getValue () {
        return this.value
    }
    isRegular () {
        return typeof this.value === 'number'
    }
    getLeft () {
        if (this.isRegular()) { throw new Error('Getting left of regular number')}
        return this.value[0]
    }
    getRight () {
        if (this.isRegular()) { throw new Error('Getting right of regular number')}
        return this.value[1]
    }
    toString () {
        return JSON.stringify(this.toPlain())
    }
    toPlain () {
        if (this.isRegular()) {
            return this.value
        } else {
            return [
                typeof this.getLeft() === 'number' ? this.getLeft() : this.getLeft().toPlain(),
                typeof this.getRight() === 'number' ? this.getRight() : this.getRight().toPlain(),
            ]
        }
    }
    inc (byVal) {
        this.value += byVal.getValue()
    }
}

const assignNearestNeighbours = (val) => {
    let lastNode = null

    const parseChildren = (node) => {
        if (node.isRegular()) {
            if (lastNode) {
                lastNode.firstRegularToRight = node
            }
            node.firstRegularToLeft = lastNode
            lastNode = node
        } else {
            const [first, last] = node.getValue()
            parseChildren(first)
            parseChildren(last)
        }
    }
    parseChildren(val)
}

const explodeOnce = (value, depth, props) => {
    if (value.isRegular()) {
        return value
    } else {
        if (depth === 4 && !props.exploded) {
            if (value.getLeft().firstRegularToLeft) {
                value.getLeft().firstRegularToLeft.inc(value.getLeft())
            }
            if (value.getRight().firstRegularToRight) {
                value.getRight().firstRegularToRight.inc(value.getRight())
            }
            props.exploded = true
            return new SnailfishNumber(0)
        }

        return new SnailfishNumber([
            explodeOnce(value.getLeft(), depth + 1, props),
            explodeOnce(value.getRight(), depth + 1, props),
        ])
    }
}

const parseVal = (val) => {
    let workingVal = val
    do {
        assignNearestNeighbours(workingVal)

        const props = {}
        workingVal = explodeOnce(workingVal, 0, props)
        if (props.exploded) continue

        workingVal = splitOnce(workingVal, 0, props)
        if (props.exploded) continue


        if (!props.split && !props.exploded) {
            break
        }

    } while (true)
    return workingVal
}


const splitOnce = (value, depth, props) => {
    if (value.isRegular()) {
        if (value.getValue() >= 10 && !props.split) {
            const val = value.getValue()
            props.split = true
            return toSnailfishNumbers([
                Math.floor(val / 2),
                Math.ceil(val / 2)
            ])
        } else {
            return value
        }
    } else {
        return new SnailfishNumber([
            splitOnce(value.getLeft(), depth + 1, props),
            splitOnce(value.getRight(), depth + 1, props),
        ])
    }
}


const toSnailfishNumbers = (val) => {
    if (typeof val === 'number') {
        return new SnailfishNumber(val)
    } else {
        return new SnailfishNumber(val.map((v) => toSnailfishNumbers(v)))
    }
}

const add = (first, second) => {
    return new SnailfishNumber([first, second])
}

const findMagnitude = (value) => {
    return typeof value === 'number' ? value : 3 * findMagnitude(value[0]) + 2 * findMagnitude(value[1])
}

function part1(input) {
    const inputNumbers = JSON.parse(`[${input.split('\n').join(',')}]`)

    const stack = inputNumbers.map((n) => {
        const numbers = toSnailfishNumbers(n)
        assignNearestNeighbours(numbers)
        return numbers
    })

    let val = stack.shift()
    while (stack.length > 0) {
        val = parseVal(add(val, stack.shift()))
    }

    const finalVal = val.toPlain()

    return findMagnitude(finalVal)
}


function part2(input) {
    const inputNumbers = input.split('\n')
    let maxMagnitude = Number.MIN_SAFE_INTEGER

    inputNumbers.forEach((num1) => {
        inputNumbers.forEach((num2) => {
            if (num1 === num2) {
                return
            }
            const val = JSON.parse(`[${num1},${num2}]`)
            const sum = parseVal(toSnailfishNumbers(val)).toPlain()
            const magnitude = findMagnitude(sum)

            if (magnitude > maxMagnitude) {
                maxMagnitude = magnitude
            }
        })
    })
    return maxMagnitude
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })