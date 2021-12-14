const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`

const parse = (input) => {
    const [templateStr, rulesStr] = input.split('\n\n')
    const template = templateStr
    const rules = rulesStr.split('\n').map((rule) => rule.split(' -> '))
    return [template, rules]
}

function part1(input, iterations) {
    const [template, rules] = parse(input)

    const doIteration = (template) => {
        let insertions = []
        for (let i=0; i<template.length - 1; i++) {
            const rule = rules.find(([f, t]) => f === template.substr(i, 2))
            insertions.push([i+1, rule[1]])
        }
        let newTemplate = template.split('')
        insertions.forEach(([offset, letter], index) => {
            newTemplate.splice(offset + index, 0, letter)
        })
        return newTemplate.join('')
    }

    let finalResult = template
    for (let i=0; i<iterations; i++) {
        finalResult = doIteration(finalResult)
    }

    const frequencies = [...new Set(finalResult.split(''))].map((letter) => {
        return [letter, finalResult.split(letter).length - 1]
    })

    frequencies.sort((a, b) => a[1] - b[1])
    return frequencies[frequencies.length-1][1] - frequencies[0][1]
}


function part2(input, iterations) {
    const [template, rules] = parse(input)
    const rulesMap = Object.fromEntries(rules)

    // init pairs
    const pairCounts = template.split('').reduce((acc, letter, key) => {
        if (template[key+1]) {
            acc[`${template[key]}${template[key+1]}`] = 1
        }
        return acc
    }, {})

    let pairs = {...pairCounts}

    // run stuff
    for (let i=0; i<iterations; i++) {
        const newPairs = {...pairs}
        const operations = [] // [pair, delta]
        Object.entries(newPairs).forEach(([pair, count]) => {
            const insertion = rulesMap[pair]
            operations.push([`${pair[0]}${insertion}`, newPairs[pair]])
            operations.push([`${insertion}${pair[1]}`, newPairs[pair]])
            operations.push([pair, -newPairs[pair]])
        })
        operations.forEach(([pair, delta]) => {
            if (!newPairs[pair]) { newPairs[pair] = 0 }
            newPairs[pair] = newPairs[pair] + delta
        })

        pairs = Object.fromEntries(Object.entries(newPairs).filter(([k, v]) => v > 0))
    }

    // calculate frequency
    const frequencies = Object.entries(Object.entries(pairs).reduce((acc, [pair, qty]) => {
        const letter = pair[1]
        if (!acc[letter]) {
            acc[letter] = 0
        }
        acc[letter] += qty
        return acc
    }, {[template[0]]: 1}))
    frequencies.sort((a, b) => a[1] - b[1])
    return frequencies[frequencies.length-1][1] - frequencies[0][1]
}

console.log('-- test input')
console.log({ part1: part1(testInput, 10) })
console.log({ part2: part2(testInput, 40) })

console.log('-- real input')
console.log({ part1: part1(realInput, 10) })
console.log({ part2: part2(realInput, 40) })
