'use strict';

const Controller = require('egg').Controller;

class ChaatController extends Controller {
  async exchange() {
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    let message = ctx.args[0] || {};
    const room = message.room_id;

    try {
      const result = await this.service.messageManager.create(message)
      message._id = result.insertId
      nsp.emit('chaat', message);

    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = ChaatController;
