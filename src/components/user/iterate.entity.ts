import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Iterate {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  iterate: number;
}
