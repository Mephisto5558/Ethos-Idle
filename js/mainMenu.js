export default true;
const mainMenu = document.querySelector('#main-menu');
let activeElement;
document.querySelector('header > #menu-btn').addEventListener('click', () => mainMenu.classList.toggle('hidden'));
mainMenu.addEventListener('click', event => {
    if (!(event.target instanceof HTMLButtonElement))
        return;
    activeElement = mainMenu.querySelector(`#${event.target.id.replace('-btn', '')}`);
    activeElement.classList.add('child-no-hide');
    mainMenu.classList.add('hide-children');
});
document.querySelector('#main-menu > #menu-back-btn').addEventListener('click', () => {
    if (activeElement) {
        activeElement.classList.remove('child-no-hide');
        mainMenu.classList.remove('hide-children');
        activeElement = undefined;
    }
    else
        mainMenu.classList.toggle('hidden');
});
//# sourceMappingURL=mainMenu.js.map