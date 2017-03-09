// Named Export
export const apiKey = 'abc123';

export const url = 'http://daniel.deverell.com';

export function sayHi(name) {
  console.log(`Hello there ${name}`);
}

const age = 100;
const animal = 'rhino';

export { age as old, animal };
