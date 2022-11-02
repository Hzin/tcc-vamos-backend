import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Itinerary from './Itinerary';

@Entity('destinations')
class Destination {
  @PrimaryGeneratedColumn('increment')
  id_destination: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.destinations)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  itinerary_id: string;

  @Column()
  formatted_address: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  is_final: boolean;
}

export default Destination;
