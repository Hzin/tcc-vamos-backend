import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ItineraryContract } from '../enums/ItineraryContract';
import { PassengerRequestStatus } from '../enums/PassengerRequestStatus';
import { SchoolPeriod } from '../enums/SchoolPeriod';
import Itinerary from './Itinerary';
import User from './User';

@Entity('passengers_requests')
class PassengerRequest {
  @PrimaryGeneratedColumn('increment')
  id_passenger_request: number;

  @ManyToOne(() => Itinerary, itinerary => itinerary.neighborhoods_served)
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @Column()
  itinerary_id: string;

  @ManyToOne(() => User, user => user.passenger_request)
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
      enum: PassengerRequestStatus,
      default: PassengerRequestStatus.pending,
    }
  )
  status: PassengerRequestStatus;

  @CreateDateColumn()
  created_at: Date;

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
}

export default PassengerRequest;
