const romanToArabic: readonly [string, number][] = [
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
  ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
  ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  /* eslint-enable @typescript-eslint/no-magic-numbers */
];

export function romanize(num: number): string {
  let roman = '';
  for (const [symbol, value] of romanToArabic) {
    while (num >= value) {
      roman += symbol;
      num -= value;
    }
  }

  return roman;
}

export function centerActiveButton(element?: Element): void {
  element?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

export function exactNow(): number {
  return performance.timeOrigin + performance.now();
}

export async function sleep(sleepMS: number): Promise<void> {
  return new Promise(res => void setTimeout(res, sleepMS));
}