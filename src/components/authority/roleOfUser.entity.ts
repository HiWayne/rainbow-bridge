import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity()
@Exclude()
export class RoleOfUser {
  @Expose()
  @PrimaryColumn('int')
  id: number;

  @Expose()
  @Column('text')
  roles: string;

  @Expose()
  @Column('datetime')
  update_time: string;

  @Expose()
  @CreateDateColumn({ type: 'datetime' })
  create_time: string;
}
