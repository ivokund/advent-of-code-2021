const setToMap = (set) => set.reduce((acc, coords, index) => ({...acc, [coords.join()]: index}), {})

const getRelativePositionsFromSetIndex = (set, index) => {
    const [dx, dy, dz] = set[index]
    return set.map(([x, y, z]) => [x - dx, y - dy, z - dz])
}

const findOverlappingBeacons = (set1, set2, numBeacons) => {
    for (let set1Index=0; set1Index < set1.length; set1Index++) {
        const set1Relative = getRelativePositionsFromSetIndex(set1, set1Index)

        for (let j = 0; j < set2.length; j++) {

            const set2Relative = getRelativePositionsFromSetIndex(set2, j)
            const map2Relative = setToMap(set2Relative)

            const matchingBeacons = set1Relative.reduce((acc, coords, set1Index) => {
                const coordStr = coords.join()
                if (map2Relative[coordStr] !== undefined) {
                    acc.push([set1[set1Index], set2[map2Relative[coordStr]]])
                }
                return acc
            }, [])

            if (matchingBeacons.length >= numBeacons) {
                return matchingBeacons
            }
        }
    }

    return []
}

module.exports = { findOverlappingBeacons }
