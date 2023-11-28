const mockup = {
	"page": 1,
	"perPage": 30,
	"totalItems": 1,
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
			"shotDetail": "Unforgettable tooo! Testing edit\r\nTesting update",
			"shotName": "Wonderful World",
			"shotNum": 1,
			"updated": "2023-11-24 13:40:40.564Z"
		}
	]
}

const initialNodes = [
    {
        id: '3',
        type: "textUpdater",
        position: { x: 0, y: 200 },
        data: { value: "test", second: "kamehameha" }
    }
];
const initialEdges = [
    {
        id: 'e1-2',
        source: '1',
        target: '2'
    }
];

function initNodes(serverData) {
    const allItems = serverData.items
    const mapped = allItems.map((item) => {
        const cleanData = {...item}
        delete cleanData.collectionId
        delete cleanData.collectionName
        delete cleanData.coordinate
        delete cleanData.id
        delete cleanData.sceneID
        delete cleanData.sequenceID

        return {
            dbID : item.id,
            position: item.coordinate,
            data : cleanData
        }
    })

    return mapped
}

console.log(initNodes(mockup));

