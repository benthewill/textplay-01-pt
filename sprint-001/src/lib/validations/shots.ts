export let requirementCategories = [
    {value: "inventory", label: "Inventory"},
    {value: "infection", label: "Infection"},
    {value: "access", label: "Access"}
]

export let inventoryItems = [
    {value: "defaultVal", label: "Select Item"},
    {value: "clock", label: "Clock"},
    {value: "book", label: "Book"},
    {value: "alien", label: "Alien"}
]

export let infectionItems = [
    {value: "defaultVal", label: "Select Item"},
    {value: "black", label: "Black"},
    {value: "white", label: "White"},
    {value: "gray", label: "Gray"}
]

export let accessItems = [
    {value: "defaultVal", label: "Select Item"},
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
    dbID: "new",
    itemRequired: "nz392j29v1zif43",
    infectionRequired: "placeholderData",
    amount: 0,
    operator: "="
}

export let defaultRequirement = {
    gate: "item",
    expand: {
        requirementItems: [
            reqItem
        ]
    }
}

export let ANDRequirement = {
    gate: "and",
    expand: {
        requirementItems: [reqItem]
    }
}

export let defaultNarration = {
    narrationContent: "",
    expand: {
        requirements: [defaultRequirement]
    }
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