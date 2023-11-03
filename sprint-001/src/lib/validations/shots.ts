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
    narrationID: " ",
    narrationContent: " ",
    requirements: [defaultRequirement]
}

export let defaultDecision = {
    decisionID: " ",
    decisionContent: " ",
    requirements: [defaultRequirement]
}


export let defaultShot = {
    shotNum: "",
    shotID: "",
    sceneID: "",
    sequenceID: "",
    possibleNarrations: [
        defaultNarration
    ],
    possibleDecisions: [
        defaultDecision
    ]
}