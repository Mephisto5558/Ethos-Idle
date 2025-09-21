const romanToArabic = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
];
export function romanize(num) {
    let roman = '';
    for (const [symbol, value] of romanToArabic) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }
    return roman;
}
export function centerActiveButton(element) {
    element?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}
//# sourceMappingURL=utils.js.map