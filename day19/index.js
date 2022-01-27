const fs = require('fs')
const path = require('path')
const {createSetVariations} = require("./variations");
const {findOverlappingBeacons} = require("./overlap");
const realInput = fs.readFileSync(path.join(__dirname, '/input.txt'), 'utf-8')

const testInput = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`


function calculate(input) {
    const scannerBeacons = input.split('\n\n').map((linesTxt) => {
        const lines = linesTxt.split('\n')
        const [, id] = /--- scanner (\d+) ---+/.exec(lines.shift())
        const beacons = lines.map((line) => line.split(',').map((num) => +num))
        return [+id, beacons]
    })

    const beaconSets = scannerBeacons.reduce((acc, [scannerNo, beacons], key) => {
        const beaconVariantSets = key === 0 ? [beacons] : createSetVariations(beacons)
        return {...acc, [scannerNo]: beaconVariantSets}
    }, {})

    const comparisonSets = Object.values(Object.keys(beaconSets).reduce((acc, id1) => {
        Object.keys(beaconSets).forEach((id2) => {
            if (!acc[`${id1}-${id2}`] && !acc[`${id2}-${id1}`] && id1 !== id2) {
                acc[`${id1}-${id2}`] = [id1, id2]
            }
        })
        return acc
    }, {}))

    const beaconsToCompare = comparisonSets.reduce((acc, [scannerId1, scannerId2]) => {
        beaconSets[scannerId1].forEach((beacons1, rotation1) => {
            beaconSets[scannerId2].forEach((beacons2, rotation2) => {
                acc.push([
                    {scannerId1, beacons1, rotation1},
                    {scannerId2, beacons2, rotation2},
                ])
            })
        })
        return acc
    }, [])

    const manhattanDistance = (coord1, coord2) => coord1.reduce((acc, val, key) => {
        return acc + Math.abs(coord1[key] - coord2[key])
    }, 0)

    const minus = ([c1x, c1y, c1z], [c2x, c2y, c2z]) => [c1x - c2x, c1y - c2y, c1z - c2z]
    const plus = ([c1x, c1y, c1z], [c2x, c2y, c2z]) => [c1x + c2x, c1y + c2y, c1z + c2z]

    const beaconAbsLocations = {}

    const scannerAbsPositions = {'0': [0, 0, 0]}
    const scannerRotations = {}

    while (beaconsToCompare.length > 0) {
        const comparingNow = beaconsToCompare.shift()
        const [{scannerId1, beacons1, rotation1}, {scannerId2, beacons2, rotation2}] = comparingNow

        // check if another successful rotation already exists
        if (scannerRotations[scannerId1] !== undefined && scannerRotations[scannerId1] !== rotation1) { continue }
        if (scannerRotations[scannerId2] !== undefined && scannerRotations[scannerId2] !== rotation2) { continue }

        if (!scannerAbsPositions[scannerId1] && !scannerAbsPositions[scannerId2]) {
            // no anchors yet, try again later
            beaconsToCompare.push(comparingNow)
            continue
        }

        const beacons = findOverlappingBeacons(beacons1, beacons2, 12)

        if (beacons.length >= 12) {
            scannerRotations[scannerId1] = rotation1
            scannerRotations[scannerId2] = rotation2

            const beaconsDelta = minus(beacons[0][0], beacons[0][1])

            if (!scannerAbsPositions[scannerId1]) {
                scannerAbsPositions[scannerId1] = minus(scannerAbsPositions[scannerId2], beaconsDelta)
            }

            if (!scannerAbsPositions[scannerId2]) {
                scannerAbsPositions[scannerId2] = plus(scannerAbsPositions[scannerId1], beaconsDelta)
            }

            beacons1.map((beacon) => plus(beacon, scannerAbsPositions[scannerId1]))
                .concat(beacons2.map((beacon) => plus(beacon, scannerAbsPositions[scannerId2])))
                .forEach((beacon) => {
                    beaconAbsLocations[beacon.join()] = true
                })
        }
    }

    const largestManhattanDistance = Object.values(scannerAbsPositions).reduce((max, pos1) => {
        for (let pos2 of Object.values(scannerAbsPositions)) {
            const distance = manhattanDistance(pos1, pos2)
            if (distance > max) {
                max = distance
            }
        }
        return max
    }, -Infinity)

    return {
        part1: Object.keys(beaconAbsLocations).length,
        part2: largestManhattanDistance
    }
}


console.log('-- test input')
console.log(calculate(testInput))

console.log('-- real input')
console.log(calculate(realInput))
