'use strict';

const Service = require('egg').Service;

class MessageManagerService extends Service {
  async get_old(room_id, message_id, limit) {
    const result = await this.app.mysql.query('SELECT * FROM (SELECT * FROM message WHERE room_id = ? AND _id < ? ORDER BY _id DESC LIMIT ?) aa ORDER BY _id', [room_id, message_id, limit]);
    return result;
  }

  async get_oldest(room_id) {
    const result = await this.app.mysql.query('SELECT * FROM (SELECT * FROM message WHERE room_id = ? ORDER BY _id ASC LIMIT 1) aa ORDER BY _id', [room_id]);
    return result[0]
  }

  async update_seen(id, seen) {
    const options = {
      where: {
        _id: id
      }
    };
    const result = await this.app.mysql.update('message', { seen: seen }, options);
    const updateSuccess = result.affectedRows === 1;
    return updateSuccess;
  }

  async create(message) {
    const result = await this.app.mysql.insert('message', message);
    const options = {
      where: {
        _id: message.room_id
      }
    };
    await this.app.mysql.update('room', { last_message_id: result.insertId, last_changed: message.time }, options);
    return result
  }
}

module.exports = MessageManagerService;