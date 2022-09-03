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
  name: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  // @CreateDateColumn()
  // created_at: Date;

  // @UpdateDateColumn()
  // updated_at: Date;
}

export default Destination;
