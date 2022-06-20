import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import VanLocator from './VanLocator';

@Entity('vanDocuments')
class VanDocuments {
  @PrimaryColumn()
  @OneToOne(() => VanDocuments, { eager: true })
  @JoinColumn({ name: 'document' })
  vanDocuments: VanDocuments;

  @OneToOne(() => VanLocator, { eager: true })
  @JoinColumn({ name: 'vanLocator_id' })
  vanLocator: VanLocator;

  @Column()
  document_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VanDocuments;
