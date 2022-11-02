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

@Entity('neighborhoods_served')
class NeighborhoodServed {
  @PrimaryGeneratedColumn('increment')
  id_neighborhood: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.neighborhoods_served)
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
}

export default NeighborhoodServed;
