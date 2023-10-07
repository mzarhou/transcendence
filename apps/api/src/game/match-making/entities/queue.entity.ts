import { Socket } from 'socket.io';

interface Player {
  id: number;
  socketId: string;
}

export class queueArr {
  players: Player[] = [];
  addPlayer(playerId: number, client: Socket) {
    this.deletePlayer(client);
    this.players.push({
      id: playerId,
      socketId: client.id,
    });
  }

  deletePlayer(client: Socket) {
    const player = this.players.find((p) => p.socketId == client.id);

    if (player) {
      this.players = this.players.filter((p) => p.socketId !== client.id);
    }
  }

  deletePlayerById(playerId: number) {
    const player = this.players.find((p) => p.id == playerId);

    if (player) {
      this.players = this.players.filter((p) => p.id !== playerId);
    }
  }
}
