/* eslint-disable @typescript-eslint/no-non-null-assertion */

export default true as boolean;
const mainMenu = document.querySelector<HTMLMenuElement>('#main-menu')!;
let activeElement: HTMLDivElement | undefined;

document.querySelector<HTMLButtonElement>('header > #menu-btn')!.addEventListener('click', () => mainMenu.classList.toggle('hidden'));

mainMenu.addEventListener('click', event => {
  if (!(event.target instanceof HTMLButtonElement)) return;

  activeElement = mainMenu.querySelector<HTMLDivElement>(`#${event.target.id.replace('-btn', '')}`)!;
  activeElement.classList.add('child-no-hide');
  mainMenu.classList.add('hide-children');
});

document.querySelector<HTMLButtonElement>('#main-menu > #menu-back-btn')!.addEventListener('click', () => {
  if (activeElement) {
    activeElement.classList.remove('child-no-hide');
    mainMenu.classList.remove('hide-children');
    activeElement = undefined;
  }
  else mainMenu.classList.toggle('hidden');
});