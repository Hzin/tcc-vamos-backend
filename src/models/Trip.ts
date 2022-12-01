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
import { TripStatus } from '../enums/TripStatus';
import { TripType } from '../enums/TripType';
import AttendanceList from './AttendanceList';
import Itinerary from './Itinerary';
import TripHistory from './TripHistory';

@Entity('trips')
class Trip {
  @PrimaryGeneratedColumn('increment')
  id_trip: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.trips)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  itinerary_id: string;

  @Column({ nullable: true })
  nickname: string;

  @Column()
  date: string;

  @Column(
    {
      type: "enum",
      enum: TripStatus,
      default: TripStatus.pending,
    }
  )
  status: TripStatus;

  @Column(
    {
      type: "enum",
      enum: TripType,
    }
  )
  type: TripType;

  @OneToMany(() => TripHistory, tripHistory => tripHistory.trip, { eager: true, cascade: true, nullable: true })
  trip_histories?: TripHistory[];

  @OneToMany(() => AttendanceList, attendanceList => attendanceList.trip, { eager: true, cascade: true, nullable: true })
  attendance_lists?: AttendanceList[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Trip;
