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
import Trip from './Trip';
import Vehicle from './Vehicle';

@Entity('id_trips_history')
class TripHistory {
  @PrimaryGeneratedColumn('uuid')
  id_trip: string;

  @ManyToOne(() => Trip, trip => trip.trip_histories)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  old_status?: string;

  @Column()
  new_status: string;

  @Column()
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TripHistory;
