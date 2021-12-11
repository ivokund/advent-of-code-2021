const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`

function part1(input) {
    const rows = input.split('\n').map((row) => row.split(''))
    const matches = {
        '[': ']',
        '(': ')',
        '{': '}',
        '<': '>',
    }
    const illegals = rows.map((characters, rowNo) => {
        const stack = [characters.shift()]
        for (let char of characters) {
            if (matches[char]) {
                stack.push(char)
            } else {
                const expected = matches[stack.pop()]
                if (expected !== char) {
                    return char
                }
            }
        }
    }).filter((i) => i)

    const points = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    }

    return illegals.reduce((sum, char) => sum + points[char], 0)
}


function part2(input) {
    const rows = input.split('\n').map((row) => row.split(''))
    const matches = {
        '[': ']',
        '(': ')',
        '{': '}',
        '<': '>',
    }
    const points = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    }
    const scores = []
    rows.reduce((acc, characters, rowNo) => {
        let score = 0
        const stack = [characters.shift()]
        let line = stack.join('')
        for (let char of characters) {
            line += char
            if (matches[char]) {
                stack.push(char)
            } else {
                const expected = matches[stack.pop()]
                if (expected !== char) {
                    return acc
                }
            }
        }
        while (stack.length > 0) {
            const char = stack.pop()
            score = score * 5 + points[matches[char]]
            line += matches[char]
        }
        acc.push(line)
        scores.push(score)
        return acc
    }, [])
    scores.sort((a, b) => a - b)
    return scores[Math.floor(scores.length / 2)]
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })