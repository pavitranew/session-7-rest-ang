import { uniq } from 'lodash';
import insane from 'insane';
import jsonp from 'jsonp';
import { apiKey as key, url, sayHi, old, dog } from './src/config';

import User, { createURL, gravatar } from './src/user';

const me = new User('Daniel Deverell', 'daniel.deverell@gmail.com', 'daniel.deverell.com');
const profile = createURL(me.name);
const image = gravatar(me.email);
console.log(image);
