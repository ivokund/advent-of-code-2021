
const createVariations = ([x, y, z]) => {
    
    return [
        // facing pos X
        [z, y, -x],
        [-y, z, -x],
        [y, -z, -x],
        [-z, -y, -x],

        // facing neg X
        [-z, y, x],
        [-y, -z, x],
        [y, z, x],
        [z, -y, x],

        // facing pos Y
        [x, z, -y],
        [-z, x, -y],
        [z, -x, -y],
        [-x, -z, -y],

        // facing neg Y
        [x, -z, y],
        [z, x, y],
        [-z, -x, y],
        [-x, z, y],

        // facing pos Z
        [-x, y, -z],
        [-y, -x, -z],
        [y, x, -z],
        [x, -y, -z],

        // facing neg Z
        [x, y, z],
        [-y, x, z],
        [y, -x, z],
        [-x, -y, z],
    ]
}

const createSetVariations = (set) => {
    const withVariations = set.map(createVariations)

    const newSets = []
    for (let i=0; i<24; i++) {
        newSets.push(withVariations.map((variations) => variations[i]))
    }
    return newSets
}
module.exports = { createSetVariations }