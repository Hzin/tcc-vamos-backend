import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { itineraryContractTypes } from '../constants/itineraryContractTypes';
import { passengerRequestStatusTypes } from '../constants/passengerRequestStatusTypes';
import { schoolPeriods } from '../constants/schoolPeriods';
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

  @ManyToOne(() => User, user => user.passengerRequest)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column(
    {
      type: "enum",
      enum: itineraryContractTypes
    }
  )
  contract_type: itineraryContractTypes;

  @Column(
    {
      type: "enum",
      enum: schoolPeriods
    }
  )
  period: schoolPeriods;

  @Column(
    {
      type: "enum",
      enum: passengerRequestStatusTypes,
      default: passengerRequestStatusTypes.pending,
    }
  )
  status: passengerRequestStatusTypes;

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
