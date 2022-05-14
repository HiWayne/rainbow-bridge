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
  @CreateDateColumn({ type: 'datetime' })
  create_time: string;

  @Expose()
  @CreateDateColumn({ type: 'datetime' })
  update_time: string;

  @Expose()
  @Column({ type: 'int' })
  creator: number;

  @Expose()
  @Column({ length: 9999 })
  collaborator: string;

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
