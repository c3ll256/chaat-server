'use strict';
const Controller = require('egg').Controller;

class UsersController extends Controller {
  async show() {
    const { ctx, service } = this;
    const id = ctx.params.id;

    const result = await service.userManager.show(id);

    ctx.response.body = result;
    ctx.status = 200;
  }

  async create() {
    const { ctx, service } = this;
    const data = ctx.request.body;

    const result = await service.userManager.create(data);

    ctx.response.body = result;
    ctx.status = 200;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    const { operate, data } = ctx.request.body;
    let result;

    switch (operate) {
      case "update_status":
        result = await service.userManager.update_status(id, data.status, data.last_changed);
        break;
      default:
        break;
    }

    ctx.response.body = result;
    ctx.status = 200;
  }
}

module.exports = UsersController;
