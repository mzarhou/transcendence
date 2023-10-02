export interface WebsocketEvent {
  rooms: string[] | number[];
  name: string;
  data: unknown;
}
