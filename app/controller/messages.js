'use strict';

const Controller = require('egg').Controller;

class ChatsController extends Controller {
  async show() {
    const { ctx, service } = this;
    const room_id = ctx.params.id;
    const operate = ctx.query.operate;
    let result;

    switch (operate) {
      case "oldest":
        result = await service.messageManager.get_oldest(room_id);
        break;
      case "old":
        const currentmessage = ctx.query.currentmessage;
        result = await service.messageManager.get_old(room_id, currentmessage, 15);
        break;
      default:
        break;
    }
    ctx.response.body = result;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    const { operate, data } = ctx.request.body;
    let result;

    console.log(id);

    switch (operate) {
      case "update_seen":
        result = await service.messageManager.update_seen(id, data.seen);
        console.log(data);
        break;
      default:
        break;
    }

    ctx.response.body = result;
    ctx.status = 200;
  }
}

module.exports = ChatsController;
