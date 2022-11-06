import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import Itinerary from './Itinerary';
import User from './User';

@Entity('passengers_requests')
class PassengerRequest {
  @PrimaryGeneratedColumn('increment')
  id_request: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.neighborhoods_served)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  itinerary_id: string;

  @ManyToOne(() => User, user => user.passenger_request)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  created_at: Date;

  @Column()
  address: string;

  @Column()
  latitude_address: number;

  @Column()
  longitude_address: number;

  @Column()
  is_single: boolean;
}

export default PassengerRequest;
