import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { attendanceListStatus } from '../constants/attendanceListStatus';
import Passenger from './Passenger';
import Trip from './Trip';
import User from './User';

@Entity('attendance_lists')
class AttendanceList {
  @PrimaryGeneratedColumn('increment')
  id_list: number;

  @ManyToOne(() => Trip, trip => trip.attendance_lists)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => Passenger, passenger => passenger.attendance_lists, {eager: true})
  @JoinColumn({ name: 'passenger_id' })
  passenger: Passenger;

  @Column()
  is_return: boolean;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: attendanceListStatus,
  })
  status: attendanceListStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AttendanceList;
