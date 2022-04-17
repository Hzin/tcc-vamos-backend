import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';

import User from './User';

@Entity('socials')
class Social {
  @PrimaryGeneratedColumn('increment')
  id_social: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  telegram: string;

  @Column()
  facebook: string;

  @Column()
  twitter: string;

  @Column()
  twitch: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Social;
