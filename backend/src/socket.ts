import { Server } from 'socket.io';
import { Notification } from './models/notification';

let io: Server;

export const initSocket = (socketServer: Server) => {
  io = socketServer;

  io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

    // Join admin room for notifications
    socket.on('join-admin', () => {
      socket.join('admin-room');
    });

    // Leave admin room
    socket.on('leave-admin', () => {
      socket.leave('admin-room');
    });
  });
};

// Emit notification to all admins
export const emitNotification = (notification: any) => {
  if (io) {
    io.to('admin-room').emit('notification', {
      ...notification,
      _id: notification._id?.toString() || notification._id,
    });
  }
};

// Get io instance
export const getIO = () => io;