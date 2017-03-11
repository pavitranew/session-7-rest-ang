import angular from 'angular';

// named function from lodash
import { uniq } from 'lodash';
// test named import using uniq
const ages = [1,1,4,52,4,12]
console.log(uniq(ages))

// our custom imports, note 'as' and from value
import { apiKey as key, url, sayHi, old, dog } from './src/config';
console.log(key)

// more custom imports
import User, { createURL, gravatar } from './src/user';

// testing more custom imports
const me = new User('Daniel Deverell', 'daniel.deverell@gmail.com', 'daniel.deverell.com');
const profile = createURL(me.name);
const image = gravatar(me.email);


export default angular.module('myApp', []);