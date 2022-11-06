import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Trip from './Trip';
import User from './User';

@Entity('attendance_lists')
class AttendanceList {
  @PrimaryGeneratedColumn('increment')
  id_list: number;

  @ManyToOne(() => Trip, trip => trip.attendance_lists)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => User, user => user.attendance_lists)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  is_return: boolean;

  @Column()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default AttendanceList;
