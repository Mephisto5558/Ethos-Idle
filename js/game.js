var IdeaType;
(function (IdeaType) {
    IdeaType[IdeaType["Red"] = 1] = "Red";
    IdeaType[IdeaType["Blue"] = 2] = "Blue";
    IdeaType[IdeaType["Green"] = 3] = "Green";
})(IdeaType || (IdeaType = {}));
export var CurrencyKind;
(function (CurrencyKind) {
    CurrencyKind["People"] = "people";
    CurrencyKind["Ideas1"] = "ideas1";
    CurrencyKind["Ideas2"] = "ideas2";
    CurrencyKind["Ideas3"] = "ideas3";
    CurrencyKind["Growth"] = "growth";
    CurrencyKind["Health"] = "health";
    CurrencyKind["Military"] = "military";
    CurrencyKind["Influence"] = "influence";
    CurrencyKind["Work"] = "work";
    CurrencyKind["Exploration"] = "exploration";
})(CurrencyKind || (CurrencyKind = {}));
export const CurrencyIconClass = {
    [CurrencyKind.People]: 'fa-users',
    [CurrencyKind.Ideas1]: 'fa-lightbulb kind1',
    [CurrencyKind.Ideas2]: 'fa-lightbulb kind2',
    [CurrencyKind.Ideas3]: 'fa-lightbulb kind3',
    [CurrencyKind.Growth]: 'fa-signal',
    [CurrencyKind.Health]: 'fa-plus',
    [CurrencyKind.Military]: 'fa-shield-halved',
    [CurrencyKind.Influence]: 'fa-star',
    [CurrencyKind.Work]: 'fa-gavel fa-rotate-270',
    [CurrencyKind.Exploration]: 'fa-sun'
};
export default class Game {
    saveVersion = 1;
    gameSpeed = 1;
    openPageId = 0;
    upgradePages = [
        [
            { name: 'Fire', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Exploration, type: 'fixed', amount: 2 }] },
            { name: 'Gathering', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Growth, type: 'fixed', amount: 2 }] },
            { name: 'Hunting', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Growth, type: 'fixed', amount: 2 },
                    { kind: CurrencyKind.Exploration, type: 'fixed', amount: 1 }
                ] },
            { name: 'Tool Use', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Work, type: 'fixed', amount: 3 }] }
        ],
        [
            { name: 'Art', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: 'fixed', amount: 4 }] },
            { name: 'Cooking', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Health, type: 'fixed', amount: 1 }] },
            { name: 'Language', type: IdeaType.Red, rewards: [
                    { kind: CurrencyKind.Ideas1, type: 'percentage', amount: 5 },
                    { kind: CurrencyKind.Ideas2, type: 'percentage', amount: 5 },
                    { kind: CurrencyKind.Ideas3, type: 'percentage', amount: 5 }
                ] },
            { name: 'Shelter', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Exploration, type: 'fixed', amount: 2 }] },
            { name: 'Spears', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Military, type: 'fixed', amount: 3 }] }
        ],
        [
            { name: 'Burial', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: 'fixed', amount: 3 }] },
            { name: 'Clothing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Exploration, type: 'fixed', amount: 3 }] },
            { name: 'Herbalism', type: IdeaType.Blue, rewards: [
                    { kind: CurrencyKind.Growth, type: 'fixed', amount: 1 },
                    { kind: CurrencyKind.Health, type: 'fixed', amount: 1 }
                ] },
            { name: 'Shamanism', type: IdeaType.Red, rewards: [
                    { kind: CurrencyKind.Ideas1, type: 'percentage', amount: 5 },
                    { kind: CurrencyKind.Growth, type: 'fixed', amount: 3 }
                ] }
        ],
        [
            { name: 'Archery', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Military, type: 'fixed', amount: 5 }] },
            { name: 'Cave Painting', type: IdeaType.Red, rewards: [
                    { kind: CurrencyKind.Ideas3, type: 'percentage', amount: 5 },
                    { kind: CurrencyKind.Exploration, type: 'fixed', amount: 1 }
                ] },
            { name: 'Fishing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Growth, type: 'fixed', amount: 2 }] },
            { name: 'Music', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: 'fixed', amount: 2 }] },
            { name: 'Textiles', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Work, type: 'fixed', amount: 3 }] }
        ],
        [
            { name: 'Domestication', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Growth, type: 'fixed', amount: 5 }] },
            { name: 'Pottery', type: IdeaType.Blue, rewards: [
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 3 },
                    { kind: CurrencyKind.Influence, type: 'fixed', amount: 2 }
                ] },
            { name: 'Sedentism', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 2 },
                    { kind: CurrencyKind.Health, type: 'fixed', amount: 3 }
                ] },
            { name: 'Warfare', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Military, type: 'fixed', amount: 3 }] }
        ],
        [
            { name: 'Agriculture', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Growth, type: 'fixed', amount: 4 },
                    { kind: CurrencyKind.Health, type: 'fixed', amount: 3 }
                ] },
            { name: 'Artisans', type: IdeaType.Red, rewards: [
                    { kind: CurrencyKind.Military, type: 'fixed', amount: 1 },
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 3 },
                    { kind: CurrencyKind.Influence, type: 'fixed', amount: 3 }
                ] },
            { name: 'Canoe', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Exploration, type: 'fixed', amount: 3 },
                    { kind: CurrencyKind.Military, type: 'fixed', amount: 1 }
                ] },
            { name: 'Symbology', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Ideas2, type: 'percentage', amount: 5 }] }
        ],
        [
            { name: 'Brewing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Health, type: 'fixed', amount: 4 }] },
            { name: 'Expeditions', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Exploration, type: 'fixed', amount: 4 }] },
            { name: 'Irrigation', type: IdeaType.Blue, rewards: [
                    { kind: CurrencyKind.Growth, type: 'fixed', amount: 4 },
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 2 }
                ] },
            { name: 'Megaliths', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: 'fixed', amount: 4 }] },
            { name: 'Weaving', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Work, type: 'fixed', amount: 4 }] }
        ],
        [
            { name: 'Architecture', type: IdeaType.Red, rewards: [
                    { kind: CurrencyKind.Health, type: 'fixed', amount: 5 },
                    { kind: CurrencyKind.Influence, type: 'fixed', amount: 5 }
                ] },
            { name: 'Sailing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Exploration, type: 'fixed', amount: 5 }] },
            { name: 'Smelting', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Military, type: 'fixed', amount: 8 },
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 4 }
                ] },
            { name: 'Wheel', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Work, type: 'fixed', amount: 6 }] }
        ],
        [
            { name: 'Bronze Working', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Military, type: 'fixed', amount: 4 },
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 8 }
                ] },
            { name: 'Government', type: IdeaType.Red, rewards: [
                    { kind: CurrencyKind.Exploration, type: 'fixed', amount: 2 },
                    { kind: CurrencyKind.Health, type: 'fixed', amount: 6 }
                ] },
            { name: 'Horseback Riding', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Exploration, type: 'fixed', amount: 4 },
                    { kind: CurrencyKind.Military, type: 'fixed', amount: 3 }
                ] },
            { name: 'Plough', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Growth, type: 'fixed', amount: 12 }] },
            { name: 'Writing', type: IdeaType.Blue, rewards: [
                    { kind: CurrencyKind.Ideas1, type: 'percentage', amount: 5 },
                    { kind: CurrencyKind.Ideas2, type: 'percentage', amount: 5 },
                    { kind: CurrencyKind.Ideas3, type: 'percentage', amount: 5 }
                ] }
        ],
        [
            { name: 'Mathematics', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Ideas2, type: 'percentage', amount: 5 }] },
            { name: 'Monarchism', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: 'fixed', amount: 12 }] },
            { name: 'Money', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 8 },
                    { kind: CurrencyKind.Influence, type: 'fixed', amount: 4 }
                ] },
            { name: 'Shipbuilding', type: IdeaType.Blue, rewards: [
                    { kind: CurrencyKind.Exploration, type: 'fixed', amount: 6 },
                    { kind: CurrencyKind.Military, type: 'fixed', amount: 2 }
                ] },
            { name: 'Swords', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Military, type: 'fixed', amount: 6 }] }
        ],
        [
            { name: 'Calendar', type: IdeaType.Blue, rewards: [
                    { kind: CurrencyKind.Growth, type: 'fixed', amount: 16 },
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 4 }
                ] },
            { name: 'Law', type: IdeaType.Red, rewards: [
                    { kind: CurrencyKind.Military, type: 'fixed', amount: 6 },
                    { kind: CurrencyKind.Health, type: 'fixed', amount: 6 }
                ] },
            { name: 'Libraries', type: IdeaType.Green, rewards: [
                    { kind: CurrencyKind.Ideas3, type: 'percentage', amount: 5 },
                    { kind: CurrencyKind.Influence, type: 'fixed', amount: 4 }
                ] },
            { name: 'Sewers', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Health, type: 'fixed', amount: 10 }] },
            { name: 'Sundial', type: IdeaType.Blue, rewards: [
                    { kind: CurrencyKind.Exploration, type: 'fixed', amount: 10 },
                    { kind: CurrencyKind.Work, type: 'fixed', amount: 4 }
                ] }
        ]
    ].map(page => page.reduce((acc, { name, type, rewards }, position) => {
        acc[name] = { position, level: 1, type, rewards: rewards };
        return acc;
    }, {}));
    currency = {
        [CurrencyKind.People]: 0,
        [CurrencyKind.Ideas1]: 0,
        [CurrencyKind.Ideas2]: 0,
        [CurrencyKind.Ideas3]: 0,
        [CurrencyKind.Growth]: 0,
        [CurrencyKind.Health]: 0,
        [CurrencyKind.Military]: 0,
        [CurrencyKind.Influence]: 0,
        [CurrencyKind.Work]: 0,
        [CurrencyKind.Exploration]: 0
    };
    #autoSaveEnabled = false;
    get openPage() {
        return this.upgradePages[this.openPageId];
    }
    save() {
        globalThis.localStorage.setItem('gameSave', btoa(JSON.stringify(this)));
    }
    load(data = {}) {
        this.saveVersion = data.saveVersion ?? this.saveVersion;
        this.gameSpeed = data.gameSpeed ?? this.gameSpeed;
        this.openPageId = data.openPageId ?? this.openPageId;
        if (data.upgradePages) {
            this.upgradePages = this.upgradePages.map((page, pageId) => Object.fromEntries(Object.entries(page).map(([k, v]) => [k, { ...v, level: data.upgradePages?.[pageId]?.[k]?.level ?? v.level }])));
        }
        this.currency = data.currency ?? this.currency;
        return this;
    }
    loadFromLocalStorage() {
        const saveDataStr = globalThis.localStorage.getItem('gameSave');
        if (!saveDataStr)
            return this;
        let saveData = JSON.parse(atob(saveDataStr));
        if (Array.isArray(saveData))
            saveData = saveData[0];
        if (!saveData)
            return this;
        if (typeof saveData != 'object' || Array.isArray(saveData))
            throw new Error('Invalid save data from localStorage');
        if (!saveData.saveVersion || saveData.saveVersion < 1)
            throw new Error('Unsupported saveData version');
        return this.load(saveData);
    }
    deleteSave() {
        globalThis.localStorage.removeItem('gameSave');
        const defaultGame = new this.constructor();
        this.saveVersion = defaultGame.saveVersion;
        this.gameSpeed = defaultGame.gameSpeed;
        this.openPageId = defaultGame.openPageId;
        this.upgradePages = defaultGame.upgradePages;
        return this;
    }
    registerAutoSave() {
        if (this.#autoSaveEnabled)
            throw new Error('Do not register autosave twice!');
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState == 'hidden')
                this.save();
        });
        window.addEventListener('pagehide', () => this.save());
        this.#autoSaveEnabled = true;
        return this;
    }
}
//# sourceMappingURL=game.js.map