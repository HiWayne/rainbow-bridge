import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 15 })
  name: string;

  @Column('text')
  avatar: string;

  @Column('text')
  desc: string;

  @Column('datetime')
  create_time: string;
}
