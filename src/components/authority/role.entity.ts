import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class Role {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 20 })
  name: string;

  @Expose()
  @Column({ length: 100 })
  desc: string;

  @Column('boolean')
  fundamental: boolean;

  @Column('int')
  creator: number;

  @Column('text')
  role_of_creator: string;

  @Column('text')
  authorities: string;

  @Column('int')
  extend: number;

  @Expose()
  @CreateDateColumn({ type: 'datetime' })
  create_time: string;
}
