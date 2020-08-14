'use strict';

exports.mysql={
    enable:true,
    package:"egg-mysql"
}
exports.cors = {
  enable: true,
  package: 'egg-cors',
credentials: true
};
exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
exports.redis = {
  enable: true,
  package: 'egg-redis',
};