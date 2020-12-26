'use strict';

const Service = require('egg').Service;

const Dayjs  = require('dayjs');
const { v1: uuidv1 } = require('uuid');

class RoomsManagerService extends Service {
  async show(id) {
    return await this.app.mysql.query("SELECT * FROM room WHERE users like ?", [ '%' + id + '%']);
  }

  async create(data) {
    return await this.app.mysql.insert('room', {
      roomId: uuidv1(),
      roomName: data.roomName,
      avatar: data.avatar,
      unreadCount: 0,
      lastMessageId: '',
      users: data.users,
      typingUsers: '',
    });
  }
}

module.exports = RoomsManagerService;
