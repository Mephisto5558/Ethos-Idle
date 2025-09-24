export default true as boolean;

document.querySelector<HTMLButtonElement>('header > #menu-btn')!.addEventListener('click', event => {
  document.querySelector('header > menu')!.classList.remove('hidden');
})