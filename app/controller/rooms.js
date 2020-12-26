'use strict';

const Controller = require('egg').Controller;

class RoomsController extends Controller {
  async create() {
    const { ctx, service } = this;
    const data = ctx.request.body;

    const result = await service.roomsManager.create(data);

    ctx.response.body = result;
    ctx.status = 200;
  }

  async show() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    console.log(id);
    const result = await service.roomsManager.show(id);
    ctx.response.body = result;
    ctx.status = 200;
  }
}

module.exports = RoomsController;
