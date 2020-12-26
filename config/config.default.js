/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606404864386_913';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    domainWhiteList: [ 'http://localhost:8080' ],
    csrf: {
      enable: false,
    },
  };

  exports.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ ],
        packetMiddleware: [ ],
      },
    },
  
    // cluster 模式下，通过 redis 实现数据共享
    redis: {
      host: '127.0.0.1',
      password: '19841001',
      port: 6379,
    },
  };
  
  // 可选
  exports.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '19841001',
      db: 0,
    },
  };

  exports.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '19841001',
      // 数据库名
      database: 'chaat',
      charset : 'utf8mb4',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
