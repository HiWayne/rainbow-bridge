import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Password {
  @Expose()
  @PrimaryColumn('int')
  id: number;

  @Expose()
  @Column('varchar')
  hash: string;
}
