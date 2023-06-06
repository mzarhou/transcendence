import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  avatar: string;
}
