const argon2 = require('argon2');

const password = '';

argon2.hash(password).then(console.log);
