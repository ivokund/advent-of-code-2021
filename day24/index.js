const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

// lines 5, 6, 16 are different
const calc = ([i1, i2, i3], z, w) => {
    const intZ = Math.trunc(z / i1)
    if ((z % 26) + i2 !== w) {
        return intZ * 26 + (w + i3)
    } else {
        return intZ
    }
}

const instructions = realInput.split('\n').map((line) => line.split(' '))

const fnInputs = []
for (let i=0; i<instructions.length; i++) {
    const i1 = +instructions[i+4][2]
    const i2 = +instructions[i+5][2]
    const i3 = +instructions[i+15][2]
    i += 17
    fnInputs.push([i1, i2, i3])
}

const model = []

let count = 0
const parseRemainingInstructions = (fnInputs, prevZ, inputDepth) => {
    count++
    const inputs = fnInputs.shift()

    for (let i = 1; i <= 9; i++) {
        model[inputDepth] = i
        const newZ = calc(inputs, prevZ, i)
        const inputsCopy = fnInputs.slice(0)

        if (inputDepth < 13) {
            parseRemainingInstructions(inputsCopy, newZ, inputDepth+1)
        } else {
            if (newZ === 0) {
                console.log('Found: ' + model.join(''))
            }
        }
    }
}

parseRemainingInstructions(fnInputs, 0, 0)
