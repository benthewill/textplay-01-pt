export let requirementCategories = [
    {value: "inventory", label: "Inventory"},
    {value: "infection", label: "Infection"},
    {value: "access", label: "Access"}
]

export let inventoryItems = [
    {value: "clock", label: "Clock"},
    {value: "book", label: "Book"},
    {value: "alien", label: "Access"}
]

export let infectionItems = [
    {value: "black", label: "Black"},
    {value: "white", label: "White"},
    {value: "gray", label: "Gray"}
]

export let accessItems = [
    {value: "manor", label: "Manor"},
    {value: "405", label: "405"},
    {value: "305", label: "305"}
]

export let operatorTypes = [
    {value: "=", label: "="},
    {value: ">", label: ">"},
    {value: "<", label: "<"},
    {value: "<=", label: "<="},
    {value: ">=", label: ">="}
]
export let gateTypes = ["item", "and", "or"]

export let reqItem = {
    requirementID: " ",
    category: "",
    item: "",
    requirement: "",
    amount: "",
    operator: ""
}

export let defaultRequirement = {
    gate: "item",
    reqData: [reqItem]
}

export let ANDRequirement = {
    gate: "and",
    reqData: [reqItem]
}

export let defaultNarration = {
    narrationContent: "",
    requirements: [defaultRequirement]
}

export let defaultDecision = {
    decisionContent: "",
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