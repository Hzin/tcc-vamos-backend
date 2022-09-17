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
import Itinerary from './Itinerary';
import TripHistory from './TripHistory';

@Entity('trips')
class Trip {
  @PrimaryGeneratedColumn('uuid')
  id_trip: string;

  @ManyToOne(() => Itinerary, itinerary => itinerary.trips)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  nickname?: string;

  @Column()
  date: string;

  @Column()
  status: string;

  @OneToMany(() => TripHistory, tripHistory => tripHistory.trip, { eager: true, cascade: true, nullable: true })
  trip_histories?: TripHistory[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Trip;
