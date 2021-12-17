const realInput = `x=288..330, y=-96..-50`
const testInput = `x=20..30, y=-10..-5`

function calculate(input) {
    const { groups } = /x=(?<x1>\-?\d+)\.\.(?<x2>\-?\d+), y=(?<y1>\-?\d+)\.\.(?<y2>\-?\d+)/.exec(input)

    const xRange = [+groups.x1, +groups.x2]
    const yRange = [+groups.y1, +groups.y2]

    const minLandingX = Math.min(...xRange)
    const maxLandingX = Math.max(...xRange)

    const minLandingY = Math.min(...yRange)
    const maxLandingY = Math.max(...yRange)

    const lowerBoundary = Math.min(minLandingY, maxLandingY)

    const landsInTargetArea = (xVel, yVel) => {
        let x = 0
        let y = 0
        let passed = false
        let landed = false
        let maxY = y

        while (!passed && !landed) {
            x += xVel
            y += yVel
            if (xVel > 0) {
                xVel--
            } else if (xVel < 0) {
                xVel++
            }
            yVel = yVel - 1
            passed = y < lowerBoundary
            landed = x >= minLandingX && x <= maxLandingX && y >= minLandingY && y <= maxLandingY

            if (y > maxY) {
                maxY = y
            }
        }
        return [landed, maxY]
    }

    const maxVelocityX = Math.max(Math.abs(xRange[0]), Math.abs(xRange[1]))
    const minVelocityX = -maxVelocityX

    const maxVelocityY = Math.max(Math.abs(yRange[0]), Math.abs(yRange[1]))
    const minVelocityY = -maxVelocityY

    let count = 0
    let maxY = Number.MIN_SAFE_INTEGER
    for (let vx = minVelocityX; vx <= maxVelocityX; vx++) {
        for (let vy = minVelocityY; vy <= maxVelocityY; vy++) {
            const [landed, y] = landsInTargetArea(vx, vy)
            if (landed) {
                count++
            }
            if (landed && y > maxY) {
                maxY = y
            }
        }
    }

    console.log({
        part1: maxY,
        part2: count,
    })
}

console.log('-- test input')
calculate(testInput)

console.log('-- real input')
calculate(realInput)
