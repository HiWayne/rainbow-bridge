import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class RoleOfUser {
  @Expose()
  @PrimaryColumn('int')
  id: number; // user_id

  @Expose()
  @Column('text')
  roles: string;

  @Expose()
  @Column('bigint')
  update_time: number;

  @Expose()
  @CreateDateColumn({ type: 'bigint' })
  create_time: number;
}
