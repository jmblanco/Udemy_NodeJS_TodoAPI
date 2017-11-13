var env = process.env.NODE_ENV || 'development';

console.log('*** Config for env:', env);

if (env === 'development' || env === 'test'){
    const config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((envKey) => {
        process.env[envKey] = envConfig[envKey];
    });
}

// if(env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
console.log('*** Config:');
console.log('*** Server Port:', process.env.PORT);
console.log('*** MongoDB URI:', process.env.MONGODB_URI);