import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column()
  name: string;

  @Column()
  email: string;
  
  @Column()
  phone_number: string;

  @Column()
  birth_date: Date;

  @Column()
  password: string;

  @Column()
  avatar_image: string;

  @Column()
  bio: string;
  
  @Column()
  star_rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
