import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vanLocator')
class VanLocator {
  @PrimaryGeneratedColumn('uuid')
  id_vanLocator: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  complement: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VanLocator;
