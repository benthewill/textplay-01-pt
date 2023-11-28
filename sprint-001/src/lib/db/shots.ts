import { checkboxGroup } from "@nextui-org/react";
import { PocketBaseInit } from "./pocketbaseinit";
import PocketBase from 'pocketbase'

export async function getAllSequences() {
    const pb = await PocketBaseInit()
    const records = await pb.collection('sequences').getFullList({
        sort: 'sequenceNum'
    })
    console.log(records);
    return records
}

export async function getAllScenesBySequence(sequenceID:string) {
    console.log(sequenceID);
    const pb = await PocketBaseInit()
    const records = await pb.collection('scenes').getList(1,50, {
        filter: `sequenceID='${sequenceID}'`
    })
    return records.items
}

export async function getAllShotsByScene(sequenceID:string, sceneID:string) {
    const pb = await PocketBaseInit()
    const records = await pb.collection('shots').getList(1, 50, {
        filter: `sceneID= '${sceneID}' && sequenceID='${sequenceID}'`,
        expand: 'possibleDecisions'
    })

    return records.items
}

export async function addConnection(sourceID:string, targetID:string) {
    const pb = await PocketBaseInit()
    const data = {
        "targetShotID": targetID
    }
    console.log(data);
    const records = await pb.collection('decision').update(sourceID, data)
    console.log(records);
    return records
}

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
        expand: 'possibleNarrations.requirements.requirementItems, possibleDecisions.requirements.requirementItems'
    })
    let newNarrs = records.expand?.possibleNarrations.map((item:any) => {
        let newForm = {
            narrID: item.id,
            ...item
        }
        delete newForm.id
        return newForm
    })


    let stringified = JSON.parse(JSON.stringify(records).replaceAll('"id"', '"dbID"'))

    return stringified
}

export async function getItems() {
    const pb = await PocketBaseInit()
    const records = await pb.collection('items').getFullList({
        sort: '-created',
    });
    let stringified = JSON.parse(JSON.stringify(records).replaceAll('"id"', '"dbID"'))
    return stringified
}

export async function getInfections() {
    const pb = await PocketBaseInit()
    const records = await pb.collection('infections').getFullList({
        sort: '-created',
    });
    let stringified = JSON.parse(JSON.stringify(records).replaceAll('"id"', '"dbID"'))
    return stringified
}

export async function updateShot (id:any, newShotData:any) {
    console.log(id)
    console.log(newShotData);
    const pb = await PocketBaseInit()
    const records = await pb.collection('shots').update(id, newShotData)
    console.log(records);
    return records
}

export async function getNarrationByID (narrID:any) {
    const pb = await PocketBaseInit()
    const record = await pb.collection('narration').getOne(narrID)
    return record
}

export async function updateNarration (narrID:any, newData:any) {
    const pb = await PocketBaseInit()
    console.log(narrID);
    console.log(newData);
    let newReqLogic:any = []

    const tempNewData:any = {...newData}
    delete tempNewData.expand

    for (let [reqLogicIdx, reqLogic] of newData.expand.requirements.entries()) {
        if (reqLogic.id === "new") {
            newReqLogic.push(reqLogic)
        } else {
            updateRequirementLogic(reqLogic.id, reqLogic)
        }
    }

    let newReqLogicRecordID: any[] = []

    for (let [reqLogicIdx, reqLogic] of newReqLogic.entries()) {
        const newReqLogicRecord = await createRequirementLogic(reqLogic)
        newReqLogicRecordID.push(newReqLogicRecord?.id)
    }

    const updateNarrRecordData = {
        "requirements+" : [...newReqLogicRecordID],
        ...tempNewData
    }

    const record = await pb.collection('narration').update(narrID, updateNarrRecordData)
    return record
}

export async function deleteNarration (narrData:any) {
    const pb = await PocketBaseInit()
    console.log(narrData);
    console.log(narrData.id);
    const record = await pb.collection('narration').delete(narrData.id)
    return record
}

export async function createNarration (newData:any, shotID:string) {
    const pb = await PocketBaseInit()
    try {
        const newNarrRecord = {
            "shotID" : shotID,
            ...newData
        }

        const record = await pb.collection('narration').create(newNarrRecord)
        console.log(record);

        let reqGates:any[] = []
        console.log(reqGates);

        if (newNarrRecord.expand.requirements.length !== 0) {
            for (let [reqGateIdx, reqGate] of newNarrRecord.expand.requirements.entries()) {
                delete reqGate.dbID
                console.log(reqGate);
                const newReqGateRecord: any = await createRequirementLogic(reqGate)
                console.log(newReqGateRecord);
                const newReqGateID = await newReqGateRecord?.id
                reqGates.push(newReqGateID)
            }
        }

        const updateNarrRecordData = {
            "requirements+": [...reqGates]
        }

        const updateNarrRecord = await pb.collection('narration').update(record?.id, updateNarrRecordData)

        const newNarrAppend = {
            "possibleNarrations+" : record?.id
        }
        const updateShot = await pb.collection('shots').update(shotID, newNarrAppend)
        return {"newNarrRecord" : record, "updatedShot" : updateShot}

    } catch (e) {
        console.log(e);
    }
}

export async function updateDecision (decID:any, newData:any) {
    const pb = await PocketBaseInit()
    console.log(decID);
    console.log(newData);
    let newReqLogic:any = []

    const tempNewData:any = {...newData}
    delete tempNewData.expand

    for (let [reqLogicIdx, reqLogic] of newData.expand.requirements.entries()) {
        if (reqLogic.id === "new") {
            newReqLogic.push(reqLogic)
        } else {
            updateRequirementLogic(reqLogic.id, reqLogic)
        }
    }

    let newReqLogicRecordID: any[] = []

    for (let [reqLogicIdx, reqLogic] of newReqLogic.entries()) {
        const newReqLogicRecord = await createRequirementLogic(reqLogic)
        newReqLogicRecordID.push(newReqLogicRecord?.id)
    }

    const updateDecRecordData = {
        "requirements+" : [...newReqLogicRecordID],
        ...tempNewData
    }

    const record = await pb.collection('decision').update(decID, updateDecRecordData)
    return record
}

export async function deleteDecision (decData:any) {
    const pb = await PocketBaseInit()
    console.log(decData);
    console.log(decData.id);
    const record = await pb.collection('decision').delete(decData.id)
    return record
}

export async function createDecision (newData:any, shotID:string) {
    const pb = await PocketBaseInit()
    try {
        const newDecRecord = {
            "shotID" : shotID,
            ...newData
        }

        const record = await pb.collection('decision').create(newDecRecord)
        console.log(record);

        let reqGates:any[] = []
        console.log(reqGates);

        if (newDecRecord.expand.requirements.length !== 0) {
            for (let [reqGateIdx, reqGate] of newDecRecord.expand.requirements.entries()) {
                delete reqGate.dbID
                console.log(reqGate);
                const newReqGateRecord: any = await createRequirementLogic(reqGate)
                console.log(newReqGateRecord);
                const newReqGateID = await newReqGateRecord?.id
                reqGates.push(newReqGateID)
            }
        }

        const updateDecRecordData = {
            "requirements+": [...reqGates]
        }

        const updateDecRecord = await pb.collection('decision').update(record?.id, updateDecRecordData)

        const newDecAppend = {
            "possibleDecisions+" : record?.id
        }
        const updateShot = await pb.collection('shots').update(shotID, newDecAppend)
        return {"newDecRecord" : record, "updatedShot" : updateShot}

    } catch (e) {
        console.log(e);
    }
}

export async function createRequirementLogic(newData:any) {
    const pb = await PocketBaseInit()
    console.log(newData);
    const tempNewData = {...newData}
    delete tempNewData.expand
    delete tempNewData.id
    tempNewData.requirements = []
    console.log(tempNewData);

    const record = await pb.collection('requirementLogic').create(tempNewData);
    console.log(record);

    let reqItems:any = []
    console.log(reqItems);

    for (let [reqItemIdx, reqItem] of newData.expand.requirementItems.entries()) {
        delete reqItem.dbID
        console.log(reqItem);
        const newReqItemRecord = await createRequirementItem(reqItem)
        console.log(newReqItemRecord);
        const newReqItemID = await newReqItemRecord?.id
        reqItems.push(newReqItemID)
    }

    console.log(reqItems);

    const updateReqLogicData = {
        "requirementItems+" : [...reqItems]
    }

    const updateReqLogicRecord = await pb.collection('requirementLogic').update(record?.id, updateReqLogicData)

    return record
}

export async function updateRequirementLogic(id:string, newData:any) {
    const pb = await PocketBaseInit()
    const tempNewData = {...newData}
    delete tempNewData.expand

    let reqItems:any = []

    for (let [reqItemIdx, reqItem] of newData.expand.requirementItems.entries()) {
        if (reqItem.id === "new") {
            const newReqItemRecord = await createRequirementItem(reqItem)
            console.log(newReqItemRecord);
            const newReqItemID = await newReqItemRecord?.id
            reqItems.push(newReqItemID)
        } else {
            updateRequirementItem(reqItem.id, reqItem)
        }
    }

    const updateReqLogicData = {
        "requirementItems+" : [...reqItems]
    }

    const updateReqLogicRecord = await pb.collection('requirementLogic').update(id, updateReqLogicData)

    const record = await pb.collection('requirementLogic').update(id, tempNewData);

    return record
}

export async function createRequirementItem (newData:any) {
    const pb = await PocketBaseInit()
    const tempNewData = {...newData}
    delete tempNewData.id
    console.log(newData);
    console.log(tempNewData);
    const record = await pb.collection('requirementItem').create(tempNewData)
    console.log(record);
    return record
}

export async function updateRequirementItem (id:string, newData:any) {
    const pb = await PocketBaseInit()
    const record = await pb.collection('requirementItem').update(id, newData)
    return record
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