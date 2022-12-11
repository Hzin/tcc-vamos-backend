import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import User from './User';

@Entity('users_searching')
class UserSearching {
  @PrimaryGeneratedColumn('increment')
  id_search: string;

  @ManyToOne(() => User, {eager: true})
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id_user' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  latitude_from: number;

  @Column()
  longitude_from: number;

  @Column()
  latitude_to: number;

  @Column()
  longitude_to: number;

  @Column()
  address_to: string;

  @CreateDateColumn()
  created_at: Date;
}

export default UserSearching;
