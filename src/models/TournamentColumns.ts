import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Tournament from './Tournament';

@Entity('tournamentColumns')
class TournamentColumns {
  @PrimaryGeneratedColumn('increment')
  id_tournamentColumns: number;

  @OneToOne(() => Tournament, { eager: true })
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column()
  column1: string;

  @Column()
  column2: string;

  @Column()
  column3: string;

  @Column()
  column4: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  tournament_initialized: boolean;

  @Column()
  tournament_ended: boolean;
}

export default TournamentColumns;
