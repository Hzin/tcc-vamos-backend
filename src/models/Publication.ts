import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Tournament from './Tournament';

@Entity('publications')
class Publication {
  @PrimaryGeneratedColumn('uuid')
  id_publication: string;

  @OneToOne(() => Tournament, { eager: true })
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Publication;
