'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  io: {
    enable: true,
    package: 'egg-socket.io'
  },

  redis: {
    enable: true,
    package: 'egg-redis'
  },

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  }
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
};
