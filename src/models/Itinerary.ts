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
import Trip from './Trip';
import Vehicle from './Vehicle';

@Entity('itineraries')
class Itinerary {
  @PrimaryGeneratedColumn('increment')
  id_itinerary: number;

  @ManyToOne(() => Vehicle, vehicle => vehicle.itineraries)
  @JoinColumn({ name: 'vehicle_plate' })
  vehicle: Vehicle;

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

  @OneToMany(() => NeighborhoodServed, neighborhoodServed => neighborhoodServed.itinerary, { eager: true, cascade: true, nullable: true })
  neighborhoodsServed?: NeighborhoodServed[];

  @OneToMany(() => Destination, destination => destination.itinerary, { eager: true, cascade: true, nullable: true })
  destinations?: Destination[];

  @OneToMany(() => Trip, trip => trip.itinerary, { eager: true, cascade: true, nullable: true })
  trips?: Trip[];

  // @CreateDateColumn()
  // created_at: Date;

  // @UpdateDateColumn()
  // updated_at: Date;
}

export default Itinerary;
