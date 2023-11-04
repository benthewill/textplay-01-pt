export let requirementTypes = ["inventory", "infection", "access"]
export let operatorTypes = ["=", ">", "<", ">=", "<="]
export let gateTypes = ["item", "and", "or"]

export let defaultRequirement = {
    gate: "item",
    reqData: [
    {
        requirementID: " ",
        type: " ",
        requirement: " ",
        amount: 0,
        operator: " "
        }
    ]
}

export let logicRequirement = {
    gate: "and",
    reqData: [
        {
        requirementID: " ",
        type: " ",
        requirement: " ",
        amount: 0,
        operator: " "
        }
    ]
}

export let defaultNarration = {
    narrationContent: " ",
    requirements: [defaultRequirement]
}

export let defaultDecision = {
    decisionContent: " ",
    requirements: [defaultRequirement]
}


export let defaultShot = {
    shotName: "",
    shotNum: "",
    sceneID: "",
    sequenceID: "",
    possibleNarrations: [
        defaultNarration
    ],
    possibleDecisions: [
        defaultDecision
    ]
}