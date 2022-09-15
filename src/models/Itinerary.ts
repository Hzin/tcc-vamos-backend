import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import Destination from './Destination';
import NeighborhoodServed from './NeighborhoodServed';
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

  @Column()
  is_active: boolean;

  @Column()
  estimated_departure_address: string;

  @Column()
  departure_latitude: number;

  @Column()
  departure_longitude: number;

  @OneToMany(() => NeighborhoodServed, neighborhoodServed => neighborhoodServed.itinerary, { eager: true, cascade: true, nullable: true })
  neighborhoodsServed?: NeighborhoodServed[];

  @OneToMany(() => Destination, destination => destination.itinerary, { eager: true, cascade: true, nullable: true })
  destinations?: Destination[];

  // @CreateDateColumn()
  // created_at: Date;

  // @UpdateDateColumn()
  // updated_at: Date;
}

export default Itinerary;
