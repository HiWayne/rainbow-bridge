import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Salt {
  @Expose()
  @PrimaryColumn('int')
  id: number;

  @Expose()
  @Column('varchar')
  salt: string;
}
