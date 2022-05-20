import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 15 })
  name: string;

  @Expose({ toClassOnly: true })
  @Column('text')
  avatar: string;

  @Expose({ toClassOnly: true })
  @Column('text')
  desc: string;

  @Expose()
  @CreateDateColumn({ type: 'bigint' })
  create_time: number;
}
