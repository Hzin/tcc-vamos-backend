import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Van from './Van';

@Entity('itineraries')
class User {
  @PrimaryGeneratedColumn('increment')
  id_itinerary: number;

  @Column()
  van_plate: string;

  @Column()
  price: number;

  @Column()
  days_of_week: number;

  @Column()
  specific_day: Date;

  @Column()
  estimated_departure_time: Date;

  @Column()
  estimated_arrival_time: Date;

  @Column()
  available_seats: number;

  @Column()
  itinerary_nickname: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
