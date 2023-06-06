import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text' })
  avatar!: string;

  @Column()
  email!: string;

  @Column()
  school42Id!: number;
}
