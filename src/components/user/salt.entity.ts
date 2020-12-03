import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Salt {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar')
  salt: string;
}
