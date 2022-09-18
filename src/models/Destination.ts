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
  address: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;
}

export default Destination;
