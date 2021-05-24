import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Iterate {
  @Expose()
  @PrimaryColumn('int')
  id: number;

  @Expose()
  @Column('int')
  iterate: number;
}
