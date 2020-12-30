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
    const operate = ctx.query.operate;
    let result;

    switch (operate) {
      case "showrooms":
        result = await service.roomsManager.show(id);
        break;
      case "isfriend":
        result = await service.roomsManager.isFriend(id, ctx.query.id);
        break;
      case "lastmessageid":
        result = await service.roomsManager.getLastMessageId(id);
        break;
      default:
        break;
    }
    ctx.response.body = result;
  }
}

module.exports = RoomsController;
