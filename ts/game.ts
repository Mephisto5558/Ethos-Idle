/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { exactNow, sleep } from './utils';

enum IdeaType {
  Red = 1,
  Blue = 2,
  Green = 3
}

export enum CurrencyKind {
  People = 'people',
  Ideas1 = 'ideas1',
  Ideas2 = 'ideas2',
  Ideas3 = 'ideas3',
  Growth = 'growth',
  Health = 'health',
  Military = 'military',
  Influence = 'influence',
  Work = 'work',
  Exploration = 'exploration'
}

export enum RewardType {
  fixed = 1,
  percentage = 2
}

export const CurrencyIconClass: Record<CurrencyKind, `fa-${string}`> = {
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

type GameData = {
  saveVersion: number;
  gameSpeed: number;
  openPageId: number;
  upgradePages: Record<Upgrade['name'], Upgrade>[];
  currency: Record<CurrencyKind, number>;
};

type Reward = {
  kind: CurrencyKind;
  type: RewardType;
  amount: number;
};

export class Upgrade {
  name: string;
  position: number;
  #level: number;
  type: IdeaType;
  rewards: Reward[];

  /** timestamp in UNIX ms */
  cooldownEndsAt = 0;

  constructor({
    name, position, level = 0, type, rewards, cooldownEndsAt = 0
  }: Pick<Upgrade, 'name' | 'position' | 'type' | 'rewards'> & Partial<Pick<Upgrade, 'level' | 'cooldownEndsAt'>>) {
    this.name = name;
    this.position = position;
    this.#level = level;
    this.type = type;
    this.rewards = rewards;
    this.cooldownEndsAt = cooldownEndsAt;
  }

  get level(): number {
    return this.#level;
  }

  /** cooldown in milliseconds */
  get cooldown(): number {
    const cooldownS = (Math.max(1, this.level) / Math.max(1, game.currency[`ideas${this.type}`])) * this.rewards.length;
    return cooldownS * 1000;
  }

  get remainingCooldown(): number {
    return Math.max(0, this.cooldownEndsAt - exactNow());
  }

  get onCooldown(): boolean {
    return this.remainingCooldown > 0;
  }

  completeUpgrade(amt = 1): void {
    this.#level += amt;
    for (const reward of this.rewards)
      game.currency[reward.kind] += reward.amount;
  }

  async upgrade(amt = 1): Promise<void> {
    if (amt && this.onCooldown) return;

    if (!this.onCooldown) this.cooldownEndsAt = exactNow() + this.cooldown;
    await sleep(this.remainingCooldown);
    this.completeUpgrade(amt);
  }

  toJSON(): object {
    /* eslint-disable @typescript-eslint/no-misused-spread -- intentional */
    return { ...this, level: this.level, cooldownEndsAt: this.cooldownEndsAt } as object;
  }
}

export default class Game implements GameData {
  saveVersion = 1;
  gameSpeed: GameData['gameSpeed'] = 1;
  openPageId: GameData['openPageId'] = 0;
  upgradePages: GameData['upgradePages'] = [
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    [ // Page 1
      { name: 'Fire', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 2 }] },
      { name: 'Gathering', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 2 }] },
      { name: 'Hunting', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 2 },
        { kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 1 }
      ] },
      { name: 'Tool Use', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Work, type: RewardType.fixed, amount: 3 }] }
    ],
    [ // Page 2
      { name: 'Art', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 4 }] },
      { name: 'Cooking', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Health, type: RewardType.fixed, amount: 1 }] },
      { name: 'Language', type: IdeaType.Red, rewards: [
        { kind: CurrencyKind.Ideas1, type: RewardType.percentage, amount: 5 },
        { kind: CurrencyKind.Ideas2, type: RewardType.percentage, amount: 5 },
        { kind: CurrencyKind.Ideas3, type: RewardType.percentage, amount: 5 }
      ] },
      { name: 'Shelter', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 2 }] },
      { name: 'Spears', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Military, type: RewardType.fixed, amount: 3 }] }
    ],
    [ // Page 3
      { name: 'Burial', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 3 }] },
      { name: 'Clothing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 3 }] },
      { name: 'Herbalism', type: IdeaType.Blue, rewards: [
        { kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 1 },
        { kind: CurrencyKind.Health, type: RewardType.fixed, amount: 1 }
      ] },
      { name: 'Shamanism', type: IdeaType.Red, rewards: [
        { kind: CurrencyKind.Ideas1, type: RewardType.percentage, amount: 5 },
        { kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 3 }
      ] }
    ],
    [ // Page 4
      { name: 'Archery', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Military, type: RewardType.fixed, amount: 5 }] },
      { name: 'Cave Painting', type: IdeaType.Red, rewards: [
        { kind: CurrencyKind.Ideas3, type: RewardType.percentage, amount: 5 },
        { kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 1 }
      ] },
      { name: 'Fishing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 2 }] },
      { name: 'Music', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 2 }] },
      { name: 'Textiles', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Work, type: RewardType.fixed, amount: 3 }] }
    ],
    [ // Page 5
      { name: 'Domestication', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 5 }] },
      { name: 'Pottery', type: IdeaType.Blue, rewards: [
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 3 },
        { kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 2 }
      ] },
      { name: 'Sedentism', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 2 },
        { kind: CurrencyKind.Health, type: RewardType.fixed, amount: 3 }
      ] },
      { name: 'Warfare', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Military, type: RewardType.fixed, amount: 3 }] }
    ],
    [ // Page 6
      { name: 'Agriculture', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 4 },
        { kind: CurrencyKind.Health, type: RewardType.fixed, amount: 3 }
      ] },
      { name: 'Artisans', type: IdeaType.Red, rewards: [
        { kind: CurrencyKind.Military, type: RewardType.fixed, amount: 1 },
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 3 },
        { kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 3 }
      ] },
      { name: 'Canoe', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 3 },
        { kind: CurrencyKind.Military, type: RewardType.fixed, amount: 1 }
      ] },
      { name: 'Symbology', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Ideas2, type: RewardType.percentage, amount: 5 }] }
    ],
    [ // Page 7
      { name: 'Brewing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Health, type: RewardType.fixed, amount: 4 }] },
      { name: 'Expeditions', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 4 }] },
      { name: 'Irrigation', type: IdeaType.Blue, rewards: [
        { kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 4 },
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 2 }
      ] },
      { name: 'Megaliths', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 4 }] },
      { name: 'Weaving', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Work, type: RewardType.fixed, amount: 4 }] }
    ],
    [ // Page 8
      { name: 'Architecture', type: IdeaType.Red, rewards: [
        { kind: CurrencyKind.Health, type: RewardType.fixed, amount: 5 },
        { kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 5 }
      ] },
      { name: 'Sailing', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 5 }] },
      { name: 'Smelting', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Military, type: RewardType.fixed, amount: 8 },
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 4 }
      ] },
      { name: 'Wheel', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Work, type: RewardType.fixed, amount: 6 }] }
    ],
    [ // Page 9
      { name: 'Bronze Working', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Military, type: RewardType.fixed, amount: 4 },
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 8 }
      ] },
      { name: 'Government', type: IdeaType.Red, rewards: [
        { kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 2 },
        { kind: CurrencyKind.Health, type: RewardType.fixed, amount: 6 }
      ] },
      { name: 'Horseback Riding', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 4 },
        { kind: CurrencyKind.Military, type: RewardType.fixed, amount: 3 }
      ] },
      { name: 'Plough', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 12 }] },
      { name: 'Writing', type: IdeaType.Blue, rewards: [
        { kind: CurrencyKind.Ideas1, type: RewardType.percentage, amount: 5 },
        { kind: CurrencyKind.Ideas2, type: RewardType.percentage, amount: 5 },
        { kind: CurrencyKind.Ideas3, type: RewardType.percentage, amount: 5 }
      ] }
    ],
    [ // Page 10
      { name: 'Mathematics', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Ideas2, type: RewardType.percentage, amount: 5 }] },
      { name: 'Monarchism', type: IdeaType.Red, rewards: [{ kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 12 }] },
      { name: 'Money', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 8 },
        { kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 4 }
      ] },
      { name: 'Shipbuilding', type: IdeaType.Blue, rewards: [
        { kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 6 },
        { kind: CurrencyKind.Military, type: RewardType.fixed, amount: 2 }
      ] },
      { name: 'Swords', type: IdeaType.Blue, rewards: [{ kind: CurrencyKind.Military, type: RewardType.fixed, amount: 6 }] }
    ],
    [ // Page 11
      { name: 'Calendar', type: IdeaType.Blue, rewards: [
        { kind: CurrencyKind.Growth, type: RewardType.fixed, amount: 16 },
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 4 }
      ] },
      { name: 'Law', type: IdeaType.Red, rewards: [
        { kind: CurrencyKind.Military, type: RewardType.fixed, amount: 6 },
        { kind: CurrencyKind.Health, type: RewardType.fixed, amount: 6 }
      ] },
      { name: 'Libraries', type: IdeaType.Green, rewards: [
        { kind: CurrencyKind.Ideas3, type: RewardType.percentage, amount: 5 },
        { kind: CurrencyKind.Influence, type: RewardType.fixed, amount: 4 }
      ] },
      { name: 'Sewers', type: IdeaType.Green, rewards: [{ kind: CurrencyKind.Health, type: RewardType.fixed, amount: 10 }] },
      { name: 'Sundial', type: IdeaType.Blue, rewards: [
        { kind: CurrencyKind.Exploration, type: RewardType.fixed, amount: 10 },
        { kind: CurrencyKind.Work, type: RewardType.fixed, amount: 4 }
      ] }
    ]
  ].map(page => Object.fromEntries(page.map((e, i) => [e.name, new Upgrade({ position: i, ...e })])));

  currency: GameData['currency'] = {
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

  /** If true, saving is disabled (for deleteSave e.g.) */
  #noSave = false;

  get openPage(): GameData['upgradePages'][number] {
    return this.upgradePages[this.openPageId]!;
  }

  save(): void {
    if (!this.#noSave) globalThis.localStorage.setItem('gameSave', btoa(JSON.stringify(this as GameData)));
  }

  load(data: Partial<GameData> | undefined = {}): this {
    this.saveVersion = data.saveVersion ?? this.saveVersion;
    this.gameSpeed = data.gameSpeed ?? this.gameSpeed;
    this.openPageId = data.openPageId ?? this.openPageId;

    if (data.upgradePages)
      this.upgradePages = this.upgradePages.map((page, pageId) => Object.fromEntries(Object.entries(page)
        .map(([k, v]) => [k, new Upgrade({ ...v, ...data.upgradePages?.[pageId]?.[k] })])
      ));

    this.currency = data.currency ?? this.currency;

    // Must be at least 1
    this.currency.ideas1 ||= 1;
    this.currency.ideas2 ||= 1;
    this.currency.ideas3 ||= 1;

    return this;
  }

  loadFromLocalStorage(): this {
    const saveDataStr = globalThis.localStorage.getItem('gameSave');
    if (!saveDataStr) return this;

    let saveData = JSON.parse(atob(saveDataStr)) as Partial<GameData> | Partial<GameData>[] | undefined;
    if (Array.isArray(saveData)) saveData = saveData[0]; // for future support of multiple saves

    if (!saveData) return this;
    if (typeof saveData != 'object' || Array.isArray(saveData)) throw new Error('Invalid save data from localStorage');

    if (!saveData.saveVersion || saveData.saveVersion < 1) throw new Error('Unsupported saveData version');

    return this.load(saveData);
  }

  deleteSave(): void {
    this.#noSave = true;

    globalThis.localStorage.removeItem('gameSave');
    globalThis.location.reload();
  }

  registerAutoSave(): this {
    if (this.#autoSaveEnabled) throw new Error('Do not register autosave twice!');

    // safer on mobile
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState == 'hidden') this.save();
    });

    // better than beforeunload
    window.addEventListener('pagehide', () => this.save());

    this.#autoSaveEnabled = true;

    return this;
  }
}