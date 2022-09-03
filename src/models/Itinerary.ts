import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Vehicle from './Vehicle';

@Entity('itineraries')
class Itinerary {
  @PrimaryGeneratedColumn('increment')
  id_itinerary: number;

  @Column()
  vehicle_plate: string;

  @Column()
  price: number;

  @Column()
  days_of_week: string;

  @Column()
  specific_day?: Date;

  @Column()
  estimated_departure_time: string;

  @Column()
  estimated_arrival_time: string;

  @Column()
  available_seats: number;

  @Column()
  itinerary_nickname: string;

  // @CreateDateColumn()
  // created_at: Date;

  // @UpdateDateColumn()
  // updated_at: Date;
}

export default Itinerary;
