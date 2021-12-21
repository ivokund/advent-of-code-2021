const testInput = [4, 8]
const realInput = [4, 3]

const playGame = (pos, dieFunc) => {

}

function part1(input) {
    const score = [0, 0]
    const pos = input.map((place) => place - 1) // 0 based

    let dieValue = 0
    let rollCount = 0
    const rollDie = () => {
        rollCount++
        if (++dieValue > 100) {
            dieValue = 1
        }
        return dieValue
    }

    const getPosValue = (player) =>  pos[player] + 1

    const incrementPos = (player, num) => {
        pos[player] += num
        if (pos[player] >= 10) {
            pos[player] -= 10 * Math.floor(pos[player] / 10)
        }
    }

    main:
    while (true) {
        for (let player of [0, 1]) {
            const roll = rollDie() + rollDie() + rollDie()
            incrementPos(player, roll)
            score[player] += getPosValue(player)
            // console.log(`${rollCount}: Player ${player+1} rolls ${roll} and moves to space ${getPosValue(player)} for a total score of ${score[player]}.`)
            if (score[player] >= 1000) {
                break main
            }
        }
    }
    return rollCount * Math.min(...score)
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