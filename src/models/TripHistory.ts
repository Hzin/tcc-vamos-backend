import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TripStatus } from '../enums/TripStatus';
import Trip from './Trip';

@Entity('trips_history')
class TripHistory {
  @PrimaryGeneratedColumn('increment')
  id_trips_history: number;

  @ManyToOne(() => Trip, trip => trip.trip_histories)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  trip_id: string;

  @Column(
    {
      type: "enum",
      enum: TripStatus,
      nullable: true
    }
  )
  old_status: TripStatus;

  @Column(
    {
      type: "enum",
      enum: TripStatus,
    }
  )
  new_status: TripStatus;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TripHistory;
