import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import VanDocuments from './VanDocuments';
import VanLocator from './VanLocator';

@Entity('vans')
class Van {
  @PrimaryGeneratedColumn('uuid')
  id_van: string;

  @Column()
  plate: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  seats_number: number;

  @OneToOne(() => VanLocator, { eager: true })
  @JoinColumn({ name: 'document' })
  locator: VanLocator;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Van;
