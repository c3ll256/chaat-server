module.exports = app => {
  const { router, controller, io } = app;
  router.resources('users', '/api/users', controller.users);
  router.resources('messages', '/api/messages', controller.messages);
  router.resources('rooms', '/api/rooms', controller.rooms);

  router.get('/cos/authkey', controller.cos.getAuth);
  // socket.io
  io.of('/').route('chaat', io.controller.chaat.exchange);
};