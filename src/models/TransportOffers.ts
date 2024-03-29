import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import User from './User';

@Entity('transport_offers')
class UserSearching {
  @PrimaryGeneratedColumn('increment')
  id_offer: string;

  @ManyToOne(() => User, {eager: true})
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id_user' })
  user: User;

  @Column()
  latitude_from: number;

  @Column()
  longitude_from: number;

  @Column()
  latitude_to: number;

  @Column()
  longitude_to: number;

  @CreateDateColumn()
  created_at: Date;
}

export default UserSearching;
