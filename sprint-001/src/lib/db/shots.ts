import { PocketBaseInit } from "./pocketbaseinit";

export async function getAllShots () {
    const pb = await PocketBaseInit()
    const records = await pb.collection('shots').getFullList({
        sort: '-created',
        expand: 'possibleNarrations.requirements.requirementItems, possibleDecisions.requirements.requirementItems'
    });
    return records
}

export async function getShot (id:string) {
    const pb = await PocketBaseInit()
    const records = await pb.collection('shots').getOne(id, {
        expand: 'possibleNarrations.requirements.requirementItems, possibleDecisions.requirements,requirementItems'
    })
    console.log(records);
    let newNarrs = records.expand?.possibleNarrations.map((item:any) => {
        console.log(item);
        let newForm = {
            narrID: item.id,
            ...item
        }
        delete newForm.id
        console.log(newForm);
        return newForm
    })
    console.log(records);
    console.log(newNarrs);

    let stringified = JSON.parse(JSON.stringify(records).replaceAll('"id"', '"dbID"'))

    console.log(stringified);

    return stringified
}

export async function updateShot (id:any, newShotData:any) {
    const pb = await PocketBaseInit()
    const records = await pb.collection('shots').update(id, newShotData)
    return records
}

export async function updateNarration (narrID:any, newData:any) {
    try {const pb = await PocketBaseInit()
    const record = await pb.collection('narration').update(narrID, newData)
    return record} catch (e) {
        console.log(e);
    }
}

export async function getNarrationByID (narrID:any) {
    const pb = await PocketBaseInit()
    const record = await pb.collection('narration').getOne(narrID)
    return record
}

export async function deleteNarrationByID (narrID:any) {
    const pb = await PocketBaseInit()
    const record = await pb.collection('narration').delete(narrID)
    return record
}

export async function getAllNarrationSHOT () {

}

export async function createNarration (newData:any, shotID:string) {
    const pb = await PocketBaseInit()
    newData.id ? delete newData.id : ""
    try {
        const newNarrRecord = {
            "shotID" : shotID,
            ...newData
        }

        const record = await pb.collection('narration').create(newNarrRecord)
        console.log(record);

        const newNarrAppend = {
            "possibleNarrations+" : record?.id
        }
        const updateShot = await pb.collection('shots').update(shotID, newNarrAppend)
        return {"newNarrRecord" : record, "updatedShot" : updateShot}

    } catch (e) {
        console.log(e);
    }

}

export async function getSequenceFromID (id:string) {
    const pb = await PocketBaseInit()

    const sequence = await pb.collection('sequences').getOne(id)

    return sequence
}

export async function getSceneFromID (id:string) {
    const pb = await PocketBaseInit()

    const scene = await pb.collection('scenes').getOne(id)

    return scene
}
export async function createShot (data:any) {
    const pb = await PocketBaseInit()

    const sequence = await pb.collection('sequences').getFirstListItem(`sequenceNum=${data.sequenceID}`)
    const scene = await pb.collection('scenes').getFirstListItem(`sceneNum=${data.sceneID}&&sequenceID="${sequence.id}"`)

    console.log(sequence.id);
    console.log(scene.id);

    let requirementsArr = []
    let possibleNarrationsArr:string[] = []
    let possibleDecisionsArr = []
    let reqDataArr = []

    for (let decision of data.possibleDecisions) {
        for (let req of decision.requirements) {
            for (let reqItem of req.reqData) {
                reqDataArr.push(reqItem)
            }
        }
    }

    const {id:shotID} = await shot()
    console.log(shotID);

    // Destructuring Array.prototype.entries() allows use of index
    for (let [idx, narr] of data.possibleNarrations.entries()) {
        let reqLogicArr = []
        const {id:narrID} = await narration(narr)
        possibleNarrationsArr.push(narrID)
        for (let [reqLogicIdx, reqLogic] of narr.requirements.entries()) {
            const {id: reqLogicID} = await requirementLogic(reqLogic)
            reqLogicArr.push(reqLogicID)
        }
        await updateNarration(narrID, reqLogicArr)
    }

    console.log("Possible Narrations", possibleNarrationsArr)

    await updateShot()

    for (let dec of data.possibleDecisions) {
        await decision(dec)
    }

    async function shot() {
        const shotData = {
            "shotName": data.shotName,
            "sequenceNum": sequence.id,
            "sceneNum": scene.id,
            "shotNum": 123,
            "possibleNarrations": [
                // "RELATION_RECORD_ID"
            ],
            "possibleDecisions": [
                // "RELATION_RECORD_ID"
            ]
        };

        const record = await pb.collection('shots').create(shotData);

        // console.log(record.id);

        return record
    }

    async function updateShot() {
        const pb = await PocketBaseInit()
        const data = {
            "possibleNarrations+" : possibleNarrationsArr
        }

        const record = await pb.collection('shots').update(shotID, data);
        console.log("Update Shot", record);

        return record
    }

    async function requirementItem() {
        const requirementItemData = {
            "category": "test",
            "item": "test",
            "operator": "=",
            "amount": 123
        };

        const record = await pb.collection('requirementItem').create(requirementItemData);

        return record
    }

    async function requirementLogic(data:any) {
        const requirementLogicData = {
            "gate": data.gate,
            "requirementItems": [
                // "RELATION_RECORD_ID"
            ]
        };

        const record = await pb.collection('requirementLogic').create(requirementLogicData);

        console.log("Record", record);

        return record
    }

    async function narration(narrationData:any) {
        const data = {
            "narrationContent": narrationData.narrationContent,
            "requirements": [
                // "RELATION_RECORD_ID"
            ],
            "shotID" : shotID
        };

        const record = await pb.collection('narration').create(data);
        console.log("Narration: ", record);
        return record
    }

    async function updateNarration(id:string, reqArr:any) {
        const pb = await PocketBaseInit()
        const data = {
            "requirements+" : reqArr
        }

        const record = await pb.collection('narration').update(id, data);
        console.log("Updated Narration", record);

        return record
    }

    async function decision(decisionData:any) {
        const data = {
            "decisionContent": decisionData.decisionContent,
            "requirements": [
                // "RELATION_RECORD_ID"
            ]
        };

        const record = await pb.collection('decision').create(data);

        return record
    }
}