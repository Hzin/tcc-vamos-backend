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

@Entity('socialInformation')
class Social {
  @PrimaryGeneratedColumn('increment')
  id_social: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  phone: string;

  @Column()
  whatsapp: string;

  @Column()
  facebook: string;

  @Column()
  telegram: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Social;
