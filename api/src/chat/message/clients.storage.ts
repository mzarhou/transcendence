import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientsStorage {
  private readonly connectedClients: Map<number, Socket[]> = new Map();

  addClient(userId: number, socket: Socket) {
    const oldSockets = this.connectedClients.get(userId);
    this.connectedClients.set(userId, [...(oldSockets ?? []), socket]);
  }

  removeClient(userId: number, socket: Socket) {
    const oldSockets = this.connectedClients.get(userId);
    if (!oldSockets) return;
    const newSockets = oldSockets.filter((s) => s.id !== socket.id);
    this.connectedClients.set(userId, newSockets);
  }

  has(userId: number, socket: Socket) {
    const sockets = this.connectedClients.get(userId);
    if (!sockets) return false;
    const index = sockets?.findIndex((s) => s.id === socket.id);
    return index > -1;
  }

  isConnected(userId: number) {
    const sockets = this.connectedClients.get(userId);
    return sockets && sockets.length > 0;
  }

  connectedSoketsCount(userId: number) {
    const sockets = this.connectedClients.get(userId);
    return sockets?.length ?? 0;
  }

  emit(usersIds: number[], event: string, ...data: any[]) {
    for (const userId of usersIds) {
      const sockets = this.connectedClients.get(userId);
      if (!sockets) return;
      for (const socket of sockets) {
        socket.emit(event, ...data);
      }
    }
  }
}
