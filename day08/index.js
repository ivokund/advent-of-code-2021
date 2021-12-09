const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput1 = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`

const testInput2 = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

function part1(input) {
    const rows = input.split('\n')
        .map((line) => line.split(' |')
            .map((str) => str.split(' ').filter((s) => s))
        )

    const counts = rows.map(([signals, outputs]) => {
        return [2, 4, 3, 7].reduce((acc, cnt) => {
            return acc + outputs.filter((s) => s.length === cnt).length
        }, 0)
    })

    return counts.reduce((sum, n) => sum + n, 0)
}


function part2(input) {
    const rows = input.split('\n')
        .map((line) => line.split(' |')
            .map((str) => str.split(' ').filter((s) => s))
        )

    const parseRow = ([signals, outputs]) => {
        const diff = (a, b) => a.filter(value => !b.includes(value));

        const signalsArr = signals.map((s) => s.split(''))

        const isEqual = (segments1Arr, segments2Arr) => {
            segments1Arr.sort()
            segments2Arr.sort()
            return segments1Arr.join('') === segments2Arr.join('')
        }

        const one = signals.find((s) => s.length === 2).split('')
        const four = signals.find((s) => s.length === 4).split('')
        const seven = signals.find((s) => s.length === 3).split('')
        const eight = signals.find((s) => s.length === 7).split('')

        const zeroOrSixOrNine = signalsArr.filter((s) => s.length === 6)

        const segmentA = diff(seven, one)[0]
        const fourWithA = [...four, segmentA]

        // figure out 9
        const nineCandidates = zeroOrSixOrNine.filter((segments) => {
            return diff(segments, fourWithA).length === 1
        })
        if (nineCandidates.length !== 1) {
            throw new Error('too many nine candidates')
        }
        const nine = nineCandidates[0]

        // now we know 0 or 6
        const zeroOrSix = zeroOrSixOrNine.filter((segments) => {
            return !isEqual(segments, nine)
        })

        const segmentG = diff(nine, fourWithA)[0]
        const segmentE = diff(eight, nine)[0]
        const zero = zeroOrSix.filter((segments) => segments.includes(one[0]) && segments.includes(one[1]))[0]
        const six = zeroOrSix.filter((segments) => !isEqual(segments, zero))[0]
        const segmentD = diff(eight, zero)[0]
        const segmentC = diff(eight, six)[0]
        const three = [...seven, segmentD, segmentG]
        const segmentB = diff(eight, [...three, segmentE])[0]
        const segmentF = diff(eight, [segmentA, segmentB, segmentC, segmentD, segmentE, segmentG])[0]

        const matches = {
            [segmentA]: 'a',
            [segmentB]: 'b',
            [segmentC]: 'c',
            [segmentD]: 'd',
            [segmentE]: 'e',
            [segmentF]: 'f',
            [segmentG]: 'g',
        }
        const segmentsToNumber = {
            abcefg: 0,
            cf: 1,
            acdeg: 2,
            acdfg: 3,
            bcdf: 4,
            abdfg: 5,
            abdefg: 6,
            acf: 7,
            abcdefg: 8,
            abcdfg: 9,
        }

        const outputDigits = outputs.map((outputSegments) => {
            const arr = outputSegments.split('').map((segId) => matches[segId])
            arr.sort()
            return segmentsToNumber[arr.join('')]
        })

        return outputDigits.join('')
    }

    const digits = rows.map((row) => parseRow(row))
    return digits.reduce((acc, digit) => acc + (+digit), 0)
}

console.log('-- test input')
console.log({ part1: part1(testInput2) })
console.log({ part2: part2(testInput2) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })