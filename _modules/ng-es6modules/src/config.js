// Named Export is imported in app.js
export const apiKey = 'abc123';

// default vs named exports
// const apiKey = 'abc123';
// export default apikey

export const url = 'http://daniel.deverell.com';

export function sayHi(name) {
  console.log(`Hello there ${name}`);
}

const age = 100;
const animal = 'rhino';

export { age as old, animal };
