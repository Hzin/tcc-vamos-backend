import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Destination from './Destination';
import NeighborhoodServed from './NeighborhoodServed';
import Vehicle from './Vehicle';

@Entity('itineraries')
class Itinerary {
  @PrimaryGeneratedColumn('increment')
  id_itinerary: number;

  @ManyToOne(() => Vehicle, vehicle => vehicle.plate)
  @JoinColumn({ name: 'vehicle_plate' })
  vehicle_plate: string;

  @Column()
  days_of_week?: string;

  @Column()
  specific_day?: Date;

  @Column()
  estimated_departure_time: string;

  @Column()
  is_active: boolean;

  @Column()
  estimated_arrival_time: string;

  @Column()
  available_seats: number;

  @Column()
  monthly_price: number;

  @Column()
  daily_price: number;

  @Column()
  accept_daily: boolean;

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

  @OneToMany(() => NeighborhoodServed, neighborhoodServed => neighborhoodServed.itinerary, { eager: true, cascade: true })
  neighborhoods_served: NeighborhoodServed[];

  @OneToMany(() => Destination, destination => destination.itinerary, { eager: true, cascade: true })
  destinations: Destination[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Itinerary;
