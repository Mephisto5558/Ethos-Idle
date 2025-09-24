/* eslint-disable @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-magic-numbers, @typescript-eslint/no-non-null-assertion */

import Game, { CurrencyIconClass } from './game.ts';
import __ from './mainMenu.ts';
import { centerActiveButton, romanize } from './utils.ts';

declare global {
  /* eslint-disable-next-line no-inner-declarations, vars-on-top */
  var game: Game;
}

const
  upgradeContainer = document.querySelector<HTMLDivElement>('#upgrades-container')!,
  upgradesGroupList = document.querySelector<HTMLUListElement>('#upgrades-group-buttons')!,
  activeElementParents = [...new Set(document.querySelectorAll(':has(>.active)'))];

let upgradesGroupListScrollBack: number | undefined;

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

upgradeContainer.addEventListener('click', (event: PointerEvent) => {
  if (!(event.target instanceof Element)) return;

  const target = event.target.closest('.upgrade');
  if (!target) return;

  const
    upgrade = game.openPage[target.querySelector('.up-name')!.textContent]!,
    levelElement = target.querySelector('.up-level')!;

  upgrade.level++;
  levelElement.textContent = upgrade.level.toLocaleString();
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
    element.querySelector('.up-level')!.textContent = data.level.toLocaleString();
    element.querySelector('.up-name')!.textContent = name;
    element.setAttribute('type', data.type.toString());

    const
      improvementsContainer = element.querySelector('.up-improvements-container')!,
      originalImprovementElement = improvementsContainer.querySelector('.up-imp')!;

    improvementsContainer.replaceChildren(...data.rewards.map(reward => {
      const improvementElement = originalImprovementElement.cloneNode(true) as HTMLDivElement;

      improvementElement.querySelector('p > .sign')!.textContent = reward.amount > 0 ? '+' : '-';
      improvementElement.querySelector('p > .value')!.textContent = reward.amount.toLocaleString();
      improvementElement.querySelector('p > .unit')!.textContent = reward.type == 'percentage' ? '%' : '';

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

document.addEventListener('DOMContentLoaded', () => {
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

  centerActiveButton(upgradesGroupList.children[game.openPageId]);
  (upgradesGroupList.children[game.openPageId]!.firstChild as HTMLButtonElement).click(); // hacky for now
});