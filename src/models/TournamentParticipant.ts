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
import User from './User';

@Entity('tournamentParticipants')
class TournamentParticipants {
  @PrimaryGeneratedColumn('increment')
  id_tournamentParticipants: string;

  @OneToOne(() => Tournament, { eager: true })
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_accepted_invite: boolean;

  @Column()
  invite_refused: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  user_kicked: boolean;
}

export default TournamentParticipants;
