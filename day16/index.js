const fs = require('fs')
const path = require('path')
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `9C0141080250320F1802104A08`

const hexToBinary = (hex) => {
    return hex.split('').map((char) => {
        return (parseInt(char, 16).toString(2)).padStart(4, '0')
    }).join('')
}
const binaryToDecimal = (binary) => parseInt(binary, 2)

const parsePacket = (bits, pointer) => {
    const version = binaryToDecimal(bits.substr(pointer + 0, 3))
    const typeId = binaryToDecimal(bits.substr(pointer + 3, 3))
    pointer += 6
    if (typeId === 4) {
        // literal value, parse subpackets (4 bits)
        const bitGroups = []
        do {
            const bitGroup = bits.substr(pointer, 5)
            pointer += 5
            bitGroups.push(bitGroup.substr(1))
            if (bitGroup.substr(0, 1) === '0') {
                break
            }
        } while (true)
        const content = bitGroups.join('')

        const packet = {version, typeId, content, contentDec: binaryToDecimal(content)}
        return [pointer, packet]
    } else {
        // operator
        const lengthType = bits.substr(pointer, 1)
        pointer++
        if (lengthType === '0') { // next 15 bits is total length of content
            const len = binaryToDecimal(bits.substr(pointer, 15))
            pointer += 15
            const contentEnd = pointer + len
            const subPackets = []

            while (pointer < contentEnd) {
                const [newPointer, packet] = parsePacket(bits, pointer)
                subPackets.push(packet)
                pointer = newPointer
            }
            return [pointer, {version, typeId, subPackets}]
        } else { // 11 bit of packet count
            const count = binaryToDecimal(bits.substr(pointer, 11))
            pointer += 11
            const subPackets = []
            for (let i=0; i<count; i++) {
                const [newPointer, packet] = parsePacket(bits, pointer)
                subPackets.push(packet)
                pointer = newPointer
            }
            return [pointer, {version, typeId, subPackets}]
        }
    }
}

function part1(input) {
    const bits = hexToBinary(input)
    const [, rootPacket] = parsePacket(bits, 0)
    const getVersionSum = (packet) => {
        const childrenVersions = (packet.subPackets || []).map((c) => getVersionSum(c))
        return packet.version + childrenVersions.reduce((sum, version) => sum + version, 0)
    }
    return getVersionSum(rootPacket)
}


function part2(input) {
    const bits = hexToBinary(input)
    const [, rootPacket] = parsePacket(bits, 0)

    const operations = {
        0: ({subPackets}) => subPackets.reduce((sum, packet) => sum + getPacketValue(packet), 0),
        1: ({subPackets}) => subPackets.reduce((prod, packet) => prod * getPacketValue(packet), 1),
        2: ({subPackets}) => Math.min(...subPackets.map((packet) => getPacketValue(packet))),
        3: ({subPackets}) => Math.max(...subPackets.map((packet) => getPacketValue(packet))),
        4: ({contentDec}) => contentDec,
        5: ({subPackets}) => +(getPacketValue(subPackets[0]) > getPacketValue(subPackets[1])),
        6: ({subPackets}) => +(getPacketValue(subPackets[0]) < getPacketValue(subPackets[1])),
        7: ({subPackets}) => +(getPacketValue(subPackets[0]) === getPacketValue(subPackets[1])),
    }

    const getPacketValue = (packet) => operations[packet.typeId](packet)
    return getPacketValue(rootPacket)
}

console.log('-- test input')
console.log({ part1: part1(testInput) })
console.log({ part2: part2(testInput) })

console.log('-- real input')
console.log({ part1: part1(realInput) })
console.log({ part2: part2(realInput) })