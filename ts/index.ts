/* eslint-disable @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-magic-numbers, @typescript-eslint/no-non-null-assertion */

import type * as __ from '@mephisto5558/better-types'; /* eslint-disable-line import-x/order, import-x/no-namespace -- load in global definitions */

import Game, { CurrencyIconClass, RewardType } from './game';

/* eslint-disable-next-line import-x/no-unassigned-import */
import './mainMenu';

import { centerActiveButton, exactNow, romanize, sleep } from './utils';
import type { CurrencyKind, Upgrade } from './game';

declare global {
  /* eslint-disable-next-line no-inner-declarations, vars-on-top */
  var game: Game;
}

const
  upgradeContainer = document.querySelector<HTMLDivElement>('#upgrades-container')!,
  upgradesGroupList = document.querySelector<HTMLUListElement>('#upgrades-group-buttons')!,
  currencyList = Object.fromEntries(
    [...document.querySelectorAll<HTMLDivElement>('footer > #items > div > div')].map(e => [e.id as CurrencyKind, Object.fromEntries(
      [...e.querySelector('p')!.children].map(e => [e.classList[0]! as 'value' | 'unit', e as HTMLSpanElement])
    )])
  ),
  activeElementParents = [...new Set(document.querySelectorAll(':has(>.active)'))];

let upgradesGroupListScrollBack: number | undefined;

function cleanUpLevelUp(target: Element, progressBar: HTMLDivElement, upgrade: Upgrade): void {
  progressBar.style.removeProperty('transition');
  progressBar.style.removeProperty('transform');

  target.querySelector('.up-level')!.textContent = upgrade.level.toLocaleString();

  for (const reward of upgrade.rewards)
    currencyList[reward.kind].value.textContent = game.currency[reward.kind].toLocaleString();
}

function startAnimation(target: Element, remainingTime: number, startProgress = 0): void {
  const progressBar = target.querySelector<HTMLDivElement>('.up-progressbar')!;

  progressBar.style.transition = 'none';
  progressBar.style.transform = `scaleX(${startProgress})`;

  // Force reflow
  void progressBar.offsetWidth;

  progressBar.style.transition = `transform ${remainingTime}ms linear`;
  progressBar.style.transform = 'scaleX(1)';
}

async function restoreCooldowns(): Promise<void> {
  for (const element of upgradeContainer.querySelectorAll<HTMLDivElement>('.upgrade:not(.hidden)')) {
    const upgrade = game.openPage[element.querySelector('.up-name')!.textContent];
    if (!upgrade?.onCooldown) continue;

    const
      remainingTime = upgrade.cooldownEndsAt - exactNow(),
      startProgress = (upgrade.cooldown - remainingTime) / upgrade.cooldown;

    startAnimation(element, remainingTime, startProgress);

    await sleep(upgrade.remainingCooldown);

    upgrade.completeUpgrade();
    cleanUpLevelUp(element, element.querySelector('.up-progressbar')!, upgrade);
  }
}

for (const element of activeElementParents) {
  element.addEventListener('click', event => {
    const
      target = event.target as Element,
      clickedButton = target.closest('button');

    if (!clickedButton || !element.contains(clickedButton)) return;

    const newActiveElement = clickedButton.closest('li, .tab');
    if (!newActiveElement) return;

    element.querySelector('.active')?.classList.remove('active');
    newActiveElement.classList.add('active');

    centerActiveButton(newActiveElement);
  });
}

upgradeContainer.addEventListener('click', async (event: PointerEvent) => {
  const target = (event.target as Element).closest<HTMLDivElement>('.upgrade');
  if (!target) return;

  const upgrade = game.openPage[target.querySelector('.up-name')!.textContent];
  if (!upgrade || upgrade.onCooldown) return;

  startAnimation(target, upgrade.cooldown);

  await upgrade.upgrade();
  cleanUpLevelUp(target, target.querySelector('.up-progressbar')!, upgrade);
});

upgradesGroupList.addEventListener('wheel', (event: WheelEvent) => {
  if (!event.deltaY) return;
  event.preventDefault();

  upgradesGroupList.scrollLeft = Math.max(0, Math.min(
    upgradesGroupList.scrollLeft + event.deltaY,
    upgradesGroupList.scrollWidth - upgradesGroupList.clientWidth
  ));

  clearTimeout(upgradesGroupListScrollBack);
  upgradesGroupListScrollBack = setTimeout(centerActiveButton, 10_000);
}, { passive: false });

upgradesGroupList.addEventListener('click', event => {
  if (!(event.target instanceof HTMLButtonElement)) return;

  const index = [...upgradesGroupList.children].indexOf(event.target.parentElement!);
  game.openPageId = index;

  const items = Object.entries(game.openPage);
  for (const [name, data] of items) {
    const element = upgradeContainer.children.item(data.position) as HTMLDivElement;
    element.querySelector('.up-level')!.textContent = data.level ? data.level.toLocaleString() : '';
    element.querySelector('.up-name')!.textContent = name;
    element.setAttribute('type', data.type.toString());

    const
      improvementsContainer = element.querySelector('.up-improvements-container')!,
      originalImprovementElement = improvementsContainer.querySelector('.up-imp')!;

    improvementsContainer.replaceChildren(...data.rewards.map(reward => {
      const improvementElement = originalImprovementElement.cloneNode(true) as HTMLDivElement;

      improvementElement.querySelector('p > .sign')!.textContent = reward.amount > 0 ? '+' : '-';
      improvementElement.querySelector('p > .value')!.textContent = reward.amount.toLocaleString();
      improvementElement.querySelector('p > .unit')!.textContent = reward.type == RewardType.percentage ? '%' : '';

      const iconElement = improvementElement.querySelector('.up-imp-icon')!;
      for (const iconClass of Object.values(CurrencyIconClass) as string[])
        iconElement.classList.remove(...iconClass.split(' '));

      iconElement.classList.add(...CurrencyIconClass[reward.kind].split(' '));

      return improvementElement;
    }));

    element.classList.remove('hidden');
  }

  for (let i = items.length; i < upgradeContainer.children.length; i++)
    upgradeContainer.children.item(i)?.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', async () => {
  globalThis.game = new Game().loadFromLocalStorage().registerAutoSave();

  for (let i = 0; i < 4; i++)
    upgradeContainer.append(upgradeContainer.firstElementChild!.cloneNode(true));

  for (let i = 0; i < game.upgradePages.length; i++) {
    let element;
    if (i) {
      element = document.createElement('li');
      element.append(...upgradesGroupList.firstElementChild!.childNodes.values().map(e => e.cloneNode()));
    }
    else element = upgradesGroupList.firstElementChild!;

    element.children[0]!.textContent = romanize(i + 1);

    if (i) upgradesGroupList.append(element);
  }

  for (const [currency, currencyElement] of Object.entries(currencyList))
    currencyElement.value.textContent = game.currency[currency].toLocaleString();

  centerActiveButton(upgradesGroupList.children[game.openPageId]);
  (upgradesGroupList.children[game.openPageId]!.firstChild as HTMLButtonElement).click(); // hacky for now

  await restoreCooldowns();
});