'use strict';

module.exports = appInfo => {

  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security

  config.keys = appInfo.name + 'zhongrixing_huiwang_server';

  // add your config here

  config.middleware = [];

  config.mysql = {
    client: {

      host: '127.0.0.1',

      port: '3306',

      user: 'root',

      password: 'a123456789',

      database: 'graduation',
    },

    app: true,

    agent: false,
  }


  config.multipart = {
    fileExtensions: ['.pdf', '.pptx', '.ppt', '.docx', '.doc'] // 增加对 apk 扩展名的文件支持
  }


  config.security = {

    csrf: {
      ignoreJSON: true,
      enable: false, ignore: ['/upload/work', '/upload/teacher/exper', "/user/auth/login", "/sise/login"],
    },

    domainWhiteList: ['http://localhost:8080', 'http://localhost:9528', 'http://localhost:8081', 'http://www.kaolaplay.com:7005','http://www.kaolaplay.com:7004']

  };

  config.cors = {
    allowMethods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true
  }
  config.io = {
    namespace: {
      '/online': {
        connectionMiddleware: ['connection'],
        packetMiddleware: ['packet']//消息处理器
      }
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '123456',
    },
  };
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
    },
  };
  return config;
};
