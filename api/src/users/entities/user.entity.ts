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

  @Column({ nullable: true })
  password!: string;

  @Column({ default: false })
  isTfaEnabled!: boolean;

  @Column({ nullable: true })
  tfaSecret!: string;

  @Column({ nullable: true })
  school42Id!: number;
}
