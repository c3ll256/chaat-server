'use strict';

const Controller = require('egg').Controller;

class CosController extends Controller {
  async getAuth() {
    const { ctx, service } = this;
    await service.cosAuthorization.getAuthorization(ctx);
  }
}

module.exports = CosController;
