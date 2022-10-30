export default (elements: HTMLFormControlsCollection, name: string): string =>
  (elements.namedItem(name) as HTMLInputElement)?.value;
