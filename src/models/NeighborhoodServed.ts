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

  @ManyToOne(() => Itinerary, itinerary => itinerary.neighborhoodsServed)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  address: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;
}

export default NeighborhoodServed;
