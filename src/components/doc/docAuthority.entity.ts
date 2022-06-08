import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Exclude()
export class DocAuthority {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'int' })
  doc_id: number;

  @Expose()
  @Column({ length: 100 })
  authority: string;

  @Expose()
  @Column({ type: 'bigint' })
  expired: number;
}
