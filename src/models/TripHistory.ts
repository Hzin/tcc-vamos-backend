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
import { tripStatus } from '../constants/tripStatus';
import Itinerary from './Itinerary';
import Trip from './Trip';
import Vehicle from './Vehicle';

@Entity('id_trips_history')
class TripHistory {
  @PrimaryGeneratedColumn('increment')
  id_trip: string;

  @ManyToOne(() => Trip, trip => trip.trip_histories)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column(
    {
      type: "enum",
      enum: tripStatus,
      nullable: true
    }
  )
  old_status: string;

  @Column(
    {
      type: "enum",
      enum: tripStatus,
    }
  )
  new_status: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TripHistory;
