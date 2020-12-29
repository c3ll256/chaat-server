'use strict';

const Service = require('egg').Service;

const DayJs = require('dayjs');
const { v1: uuidv1 } = require('uuid');

class RoomsManagerService extends Service {
  async show(id) {
    let rooms = await this.app.mysql.query("SELECT * FROM room_user WHERE user_id = ?", [ id ]);
    for (const room of rooms) {
      const results = await this.app.mysql.query("SELECT * FROM room_user WHERE room_id = ?", [ room.room_id ]);
      let users = [];
      // 只能用於一對一的聊天，多人會出問題。
      let avatar;
      let roomName;
      for (const result of results) {
        const user = await this.app.mysql.get("user", { _id: result.user_id });
        users.push({
          _id: user._id.toString(),
          username: user.username,
          avatar: user.avatar,
          status: {
            state: user.status,
            last_changed: DayJs(user.last_changed).format('YYYY-MM-DD HH:mm:ss'),
          }
        });
        if (user._id != id) {
          avatar = user.avatar;
          roomName = user.username;
        }
      }
      room.roomId = room.room_id
      room.roomName = roomName;
      room.users = users;
      room.avatar = avatar;
      delete room.room_id;
      delete room.user_id;
      delete room._id;
    }
    return rooms;
  }

  async isFriend(id, other) {
    let rooms = await this.app.mysql.query("SELECT * FROM room_user WHERE user_id = ?", [ id ]);
    for (const room of rooms) {
      const results = await this.app.mysql.query("SELECT * FROM room_user WHERE room_id = ?", [ room.room_id ]);
      for (const result of results) {
        if (result.user_id == other) return true;
      }
    }
    return false;
  }

  async getLastMessageId(id) {
    const result = await this.app.mysql.get("room", {_id: id});
    return result.last_message_id;
  }

  async create(data) {
    const isFriend = await this.isFriend(data.users[0], data.users[1]);
    if (isFriend == true) {
      return false
    } else {
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
      const user0 = await this.app.mysql.get('user', {_id: data.users[0]});
      const user1 = await this.app.mysql.get('user', {_id: data.users[1]});
      const room =   {
        roomId: room_id,
        roomName: user0.username,
        avatar: user0.avatar,
        users: [
          {
            _id: data.users[0],
            username: user0.username,
            avatar: user0.avatar,
            status: {
              state: user0.status,
              last_changed: DayJs(user0.last_changed).format('YYYY-MM-DD HH:mm:ss'),
            }
          },
          {
            _id: data.users[1],
            username: user1.username,
            avatar: user1.avatar,
            status: {
              state: user1.status,
              last_changed: DayJs(user1.last_changed).format('YYYY-MM-DD HH:mm:ss'),
            }
          }
        ],
      }
      this.app.io.of('/').emit('room', room);
      return room_id;
    }
  }
}

module.exports = RoomsManagerService;
