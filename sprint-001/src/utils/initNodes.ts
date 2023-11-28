const mockup = {
	"page": 1,
	"perPage": 30,
	"totalItems": 2,
	"totalPages": 1,
	"items": [
		{
			"collectionId": "cbb8vxutnwak9lv",
			"collectionName": "shots",
			"coordinate": {
				"x": 0,
				"y": 0
			},
			"created": "2023-11-03 12:53:09.992Z",
			"expand": {
				"possibleDecisions": [
					{
						"collectionId": "aan8ibgbnxvl8f2",
						"collectionName": "decision",
						"created": "2023-11-12 10:51:15.301Z",
						"decisionContent": "The Phantom Pain yo",
						"id": "ghnddlzc6znpqum",
						"requirements": [
							"2hh62c6rhm92ums",
							"e6lpwvefdfqi10z"
						],
						"shotID": "70n5b5s0tvgj4fo",
						"targetShotID": "irmzjm5kq4163mi",
						"updated": "2023-11-28 07:26:33.537Z"
					},
					{
						"collectionId": "aan8ibgbnxvl8f2",
						"collectionName": "decision",
						"created": "2023-11-24 12:19:37.936Z",
						"decisionContent": "Testing additional decision",
						"id": "xz52cckgl3fa5l3",
						"requirements": [
							"pwpuykntqolt3kh"
						],
						"shotID": "70n5b5s0tvgj4fo",
						"targetShotID": "",
						"updated": "2023-11-24 12:19:41.100Z"
					}
				]
			},
			"id": "70n5b5s0tvgj4fo",
			"possibleDecisions": [
				"ghnddlzc6znpqum",
				"xz52cckgl3fa5l3"
			],
			"possibleNarrations": [
				"8bubcarkaxeryt4"
			],
			"sceneID": "o3kafqorvlk7qj0",
			"sequenceID": "1f8ymj4x3xacnoi",
			"shotDetail": "Unforgettable tooo! Testing edit\nTesting update kamehameha",
			"shotName": "Wonderful World",
			"shotNum": 1,
			"updated": "2023-11-26 10:13:44.036Z"
		},
		{
			"collectionId": "cbb8vxutnwak9lv",
			"collectionName": "shots",
			"coordinate": {
				"x": 0,
				"y": 300
			},
			"created": "2023-11-26 06:47:05.905Z",
			"id": "irmzjm5kq4163mi",
			"possibleDecisions": [],
			"possibleNarrations": [
				"a1px23zginqi35g"
			],
			"sceneID": "o3kafqorvlk7qj0",
			"sequenceID": "1f8ymj4x3xacnoi",
			"shotDetail": "Nothing compares",
			"shotName": "When we swing",
			"shotNum": 2,
			"updated": "2023-11-26 10:22:55.395Z"
		}
	]
}

const initialNodes:any[] = [
    { id: '3', type: "textUpdater", position: { x: 0, y: 200 }, data: { value: "test", second: "kamehameha" } }
];

const initialEdges:any[] = [
    { id: '70n5b5s0tvgj4fo-irmzjm5kq4163mi', source: '70n5b5s0tvgj4fo', target: 'irmzjm5kq4163mi' }
];

export async function initNodes(serverData:any) {
    const mapped = serverData?.map((item:any) => {

        const cleanData = {...item}
        delete cleanData.collectionId
        delete cleanData.collectionName
        delete cleanData.coordinate
        delete cleanData.id
        delete cleanData.sceneID
        delete cleanData.sequenceID

        return {
            id : item.id,
			type : "shotNode",
            position: item.coordinate,
            data : {
				value: cleanData
			}
        }
    })

	console.log(mapped);

	return mapped
}

export async function initEdges(serverData:any) {
	console.log(serverData);
	let finalArr:any = []
	console.log(finalArr);

	const dec = serverData?.map((n:any) => {
		const allDecisions = n?.expand?.possibleDecisions
		if (allDecisions) {
			console.log("Working once");
			const mapped = allDecisions?.map((item:any, idx:any )=> {
				console.log(idx);
				let arrItem = {
					id: `e${idx}-${item.shotID}-${item.targetShotID}`,
					source: item.shotID,
					sourceHandle: item.id,
					target: item.targetShotID
				}
				finalArr.push(arrItem)
			})
			console.log(mapped);
		} else {
			console.log("Not working");
		}
	})

	console.log(dec);
	console.log(finalArr);
	return finalArr
}

export async function initSequenceNodes(serverData:any) {
	const mapped = serverData?.map((item:any) => {
		return {
			id: item.id,
			type: 'sequenceNode',
			position: {
				x: 0,
				y: (item.sequenceNum -1) * 200
			},
			data: {
				value: item
			}
		}
	})
	return mapped
}

export async function initSceneNodes(serverData:any) {
	const mapped = serverData?.map((item:any) => {
		return {
			id: item.id,
			type: 'sceneNode',
			position: {
				x: 0,
				y: (item.sceneNum -1) * 200
			},
			data: {
				value: item
			}
		}
	})
	return mapped
}