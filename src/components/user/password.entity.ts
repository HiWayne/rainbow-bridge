import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Password {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar')
  hash: string;
}
