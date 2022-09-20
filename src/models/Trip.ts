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
import TripHistory from './TripHistory';

@Entity('trips')
class Trip {
  @PrimaryGeneratedColumn('increment')
  id_trip: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.trips)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column({ nullable: true })
  nickname: string;

  @Column()
  date: string;

  @Column(
    {
      type: "enum",
      enum: tripStatus,
      default: tripStatus.pending,
    }
  )
  status: string;

  @OneToMany(() => TripHistory, tripHistory => tripHistory.trip, { eager: true, cascade: true, nullable: true })
  trip_histories: TripHistory[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Trip;
