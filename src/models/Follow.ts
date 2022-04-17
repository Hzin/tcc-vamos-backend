import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

import User from './User';

@Entity('follows')
class Follow {
  @PrimaryGeneratedColumn('increment')
  id_follow: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id_following' })
  user_following: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id_followed' })
  user_followed: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Follow;
