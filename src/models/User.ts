import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Vehicle from './Vehicle';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  birth_date: string;

  @Column()
  password: string;

  @Column()
  avatar_image: string;

  @Column()
  bio: string;

  @Column()
  star_rating: number;

  @Column()
  document_type: string;

  @Column()
  document: string;

  @OneToMany(() => Vehicle, vehicle => vehicle.user)
  vehicle: Vehicle[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
