'use strict';
const Service = require('egg').Service;

const Dayjs = require('dayjs');
const { v1: uuidv1 } = require('uuid');

class UserManagerService extends Service {
  async create(data) {
    const result = await this.app.mysql.insert('user', {
      username: data.username,
      avatar: data.avatar,
      status: "online",
      last_changed: Dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });

    return result;
  }

  async update_status(id, status, last_changed) {
    const options = {
      where: {
        _id: id
      }
    };
    const result = await this.app.mysql.update('user', { status: status, last_changed: last_changed }, options);
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) this.app.io.of('/').emit('status', {
      _id: id,
      status: status,
      last_changed: last_changed
    });
    return updateSuccess;
  }

  async update_avatar(id, avatar) {
    const options = {
      where: {
        _id: id
      }
    };
    const result = await this.app.mysql.update('user', { avatar: avatar }, options);
    const updateSuccess = result.affectedRows === 1;
    return updateSuccess;
  }

  async update_username(id, username) {
    const options = {
      where: {
        _id: id
      }
    };
    const result = await this.app.mysql.update('user', { username: username }, options);
    const updateSuccess = result.affectedRows === 1;
    return updateSuccess;
  }

  async show(id) {
    const result = await this.app.mysql.get('user', { _id: id });
    if (result == "")
      return false;
    return result;
  }
}

module.exports = UserManagerService;
