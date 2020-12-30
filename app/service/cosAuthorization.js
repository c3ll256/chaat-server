'use strict';

const Service = require('egg').Service;

const STS = require('qcloud-cos-sts');

class CosAuthorizationService extends Service {

  async getAuthorization(ctx) {
    const config = {
      secretId: this.app.config.cos.SecretId,   // 固定密钥
      secretKey: this.app.config.cos.SecretKey,  // 固定密钥
      proxy: '',
      durationSeconds: 1800,  // 密钥有效期
      // 放行判断相关参数
      bucket: 'chaat-avatar-1251621542', // 换成你的 bucket
      region: 'ap-guangzhou', // 换成 bucket 所在地区
    };

    const shortBucketName = config.bucket.substr(0, config.bucket.lastIndexOf('-'));
    const appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));

    const policy = {
      "statement": [
        {
          "action": [
            "name/cos:*"
          ],
          "effect": "allow",
          "principal": {
            "qcs": [
              "qcs::cam::uin/1308460968:uin/100017251044"
            ]
          },
          "resource": [
            "qcs::cos:ap-guangzhou:uid/1251621542:chaat-avatar-1251621542/*"
          ]
        }
      ],
      "version": "2.0"
    }

    return new Promise(async (resolve, reject) => {
      try {
        STS.getCredential(
          {
            secretId: config.secretId,
            secretKey: config.secretKey,
            proxy: config.proxy,
            durationSeconds: config.durationSeconds,
            region: config.region,
            policy: policy,
          },
          async (err, credential) => {
            console.log(err || credential) // 这里拿到错误或者临时签名信息。
            return resolve((ctx.body = err || credential));
          }
        );
      } catch (error) {
        return resolve((ctx.body = error));
      }
    });
  }
}

module.exports = CosAuthorizationService;
