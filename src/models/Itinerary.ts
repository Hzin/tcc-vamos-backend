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
import Passenger from './Passenger';
import PassengerRequest from './PassengerRequest';
import Trip from './Trip';
import User from './User';
import Vehicle from './Vehicle';

@Entity('itineraries')
class Itinerary {
  @PrimaryGeneratedColumn('increment')
  id_itinerary: number;

  @ManyToOne(() => Vehicle, vehicle => vehicle.itineraries)
  @JoinColumn({ name: 'vehicle_plate' })
  vehicle: Vehicle;

  @Column()
  vehicle_plate: string;

  @Column()
  is_active: boolean;

  @Column()
  days_of_week?: string;

  @Column()
  specific_day?: Date;

  @Column()
  estimated_departure_time_going: string;

  @Column()
  estimated_arrival_time_going: string;

  @Column()
  estimated_departure_time_return: string;

  @Column()
  estimated_arrival_time_return: string;

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
  estimated_departure_address: string;

  @Column()
  departure_latitude: number;

  @Column()
  departure_longitude: number;

  @OneToMany(() => NeighborhoodServed, neighborhoodServed => neighborhoodServed.itinerary, { eager: true, cascade: true })
  neighborhoods_served?: NeighborhoodServed[];

  @OneToMany(() => Destination, destination => destination.itinerary, { eager: true, cascade: true })
  destinations?: Destination[];

  @OneToMany(() => Trip, trip => trip.itinerary, { eager: true, cascade: true, nullable: true })
  trips?: Trip[];

  @OneToMany(() => Passenger, passenger => passenger.itinerary, { eager: true, cascade: true, nullable: true })
  passengers: Passenger[];

  @OneToMany(() => PassengerRequest, passengerRequest => passengerRequest.itinerary, { eager: true, cascade: true, nullable: true })
  passengerRequests?: PassengerRequest[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // optional
  user?: User
}

export default Itinerary;
