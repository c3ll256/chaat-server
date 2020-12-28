'use strict';

const Service = require('egg').Service;

const { v1: uuidv1 } = require('uuid');

class RoomsManagerService extends Service {
  async show(id) {
    let rooms = await this.app.mysql.query("SELECT * FROM room_user WHERE user_id = ?", [ id ]);
    for (const room of rooms) {
      const results = await this.app.mysql.query("SELECT * FROM room_user WHERE room_id = ?", [ room.room_id ]);
      let users = [];
      // 只能用於一對一的聊天，多人會出問題。
      let avatar;
      for (const result of results) {
        const user = await this.app.mysql.get("user", { _id: result.user_id });
        users.push({
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          status: {
            state: user.status,
            last_changed: user.last_changed,
          }
        });
        if (user._id != id) avatar = user.avatar;
      }
      room.users = users;
      room.avatar = avatar;
    }
    return rooms;
  }

  async isFriend(id) {
    let rooms = await this.app.mysql.query("SELECT * FROM room_user WHERE user_id = ?", [ id ]);
    for (const room of rooms) {
      const results = await this.app.mysql.query("SELECT * FROM room_user WHERE room_id = ?", [ room.room_id ]);
      for (const result of results) {
        if (result.user_id == id) return true;
      }
    }
    return false;
  }

  async create(data) {
    const room_id = uuidv1();
    for (const user of data.users) {
      await this.app.mysql.insert('room_user', {
        user_id: user,
        room_id: room_id,
      });
    }
    await this.app.mysql.insert('room', {
      _id: room_id,
      unread_count: 0,
      last_message_id: 0,
    });
    return room_id;
  }
}

module.exports = RoomsManagerService;
