import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class Doc {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 100 })
  name: string;

  @Expose()
  @Column({ length: 200 })
  desc: string;

  @Expose()
  @Column({ length: 4294967295 })
  content: string;

  @Expose()
  @Column({ length: 200 })
  cover: string;

  @Expose()
  @CreateDateColumn({ type: 'bigint' })
  create_time: number;

  @Expose()
  @CreateDateColumn({ type: 'bigint' })
  update_time: number;

  @Expose()
  @Column({ type: 'int' })
  creator: number;

  @Expose()
  @Column({ length: 10666 })
  viewers: string;

  @Expose()
  @Column({ length: 10666 })
  collaborators: string;

  @Expose()
  @Column({ type: 'int' })
  comment: number;

  @Expose()
  @Column({ type: 'int' })
  like: number;

  @Expose()
  @Column({ type: 'int' })
  collect: number;
}
