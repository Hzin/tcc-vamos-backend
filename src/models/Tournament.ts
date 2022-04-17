import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import User from './User';

@Entity('tournaments')
class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id_tournament: string;

  @Column()
  name: string;

  @Column()
  game: string;

  @Column()
  description: string;

  @Column()
  password: string;

  @CreateDateColumn()
  ended_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  number_participants: number;
}

export default Tournament;
