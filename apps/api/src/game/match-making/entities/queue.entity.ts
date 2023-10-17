export class queueArr {
  players: Set<number> = new Set();

  addPlayer(playerId: number) {
    this.players.add(playerId);
  }

  deletePlayerById(playerId: number) {
    this.players.delete(playerId);
  }
}
