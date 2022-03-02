const testInput = [4, 8]
const realInput = [4, 3]

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

    main:
        while (true) {
            for (let player of [0, 1]) {
                const roll = rollDie() + rollDie() + rollDie()
                pos[player] = (pos[player] + roll) % 10
                score[player] += pos[player] + 1
                // console.log(`${rollCount}: Player ${player+1} rolls ${roll} and moves to space ${getPosValue(player)} for a total score of ${score[player]}.`)
                if (score[player] >= 1000) {
                    break main
                }
            }
        }
    return rollCount * Math.min(...score)
}

function part2(input) {
    const positions = input.map((place) => place - 1) // 0 based

    const scoreToWin = 21
    const universeCountByState = {}
    const wins = [0, 0]

    for (let pos1 = 0; pos1 < 10; pos1++) {
        for (let score1 = 0; score1 <= scoreToWin; score1++) {
            for (let pos2 = 0; pos2 < 10; pos2++) {
                for (let score2 = 0; score2 <= scoreToWin; score2++) {
                    [0, 1].forEach((player) => {
                        universeCountByState[`${player},${pos1},${pos2},${score1},${score2}`] = 0
                    })
                }
            }
        }
    }
    universeCountByState[`0,${positions[0]},${positions[1]},0,0`] = 1
    const gamesInProgress = new Set()

    const advance = (state) => {
        const [player, pos1, pos2, score1, score2] = state.split(',').map(Number)

        const universeCount = universeCountByState[state]
        universeCountByState[state] = 0

        const incrementPos = (num) => {
            const newPos = [pos1, pos2]
            newPos[player] = (newPos[player] + num) % 10
            return newPos
        }

        for (let roll1 of [1, 2, 3]) {
            for (let roll2 of [1, 2, 3]) {
                for (let roll3 of [1, 2, 3]) {
                    const roll = roll1 + roll2 + roll3
                    const newPos = incrementPos(roll)

                    const newScores = [score1, score2]
                    newScores[player] += newPos[player]+1
                    if (newScores[player] < scoreToWin) {
                        const nextPlayer = player === 0 ? 1 : 0
                        const newState = `${nextPlayer},${newPos[0]},${newPos[1]},${newScores[0]},${newScores[1]}`
                        universeCountByState[newState] += universeCount
                        gamesInProgress.add(newState)
                    } else {
                        wins[player] += universeCount
                    }
                }
            }
        }
    }

    gamesInProgress.add(`0,${positions[0]},${positions[1]},0,0`)
    while (gamesInProgress.size > 0) {
        const game = gamesInProgress.values().next().value
        gamesInProgress.delete(game)
        advance(game)
    }

    return Math.max(...wins)

}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })