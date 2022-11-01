import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Itinerary from './Itinerary';
import User from './User';

@Entity('passengers')
class Passenger {
  @PrimaryGeneratedColumn('increment')
  id_passenger: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.passengers)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  itinerary_id: string;

  @ManyToOne(() => User, user => user.passengers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  address: string;

  @Column()
  latitude_address: number;

  @Column()
  longitude_address: number;

  @Column()
  payment_status: boolean;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  is_single: boolean;
}

export default Passenger;
