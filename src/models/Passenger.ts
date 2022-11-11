import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ItineraryContract } from '../enums/ItineraryContract';
import { PassengerStatus } from '../enums/PassengerStatus';
import { SchoolPeriod } from '../enums/SchoolPeriod';
import Itinerary from './Itinerary';
import User from './User';

@Entity('passengers')
class Passenger {
  @PrimaryGeneratedColumn('increment')
  id_passenger: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.passengers)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  itinerary_id: string;

  @ManyToOne(() => User, user => user.passengers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column(
    {
      type: "enum",
      enum: ItineraryContract
    }
  )
  contract_type: ItineraryContract;

  @Column(
    {
      type: "enum",
      enum: SchoolPeriod
    }
  )
  period: SchoolPeriod;

  @Column(
    {
      type: "enum",
      enum: PassengerStatus,
      default: PassengerStatus.ongoing,
    }
  )
  status: PassengerStatus;

  @Column()
  lat_origin: number;

  @Column()
  lng_origin: number;

  @Column()
  formatted_address_origin: string;

  @Column()
  lat_destination: number;

  @Column()
  lng_destination: number;

  @Column()
  formatted_address_destination: string;

  @Column()
  payment_status: boolean;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;
}

export default Passenger;
