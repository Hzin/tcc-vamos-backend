import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { itineraryContractTypes } from '../constants/itineraryContractTypes';
import { passengerStatusTypes } from '../constants/passengerStatusTypes';
import { schoolPeriods } from '../constants/schoolPeriods';
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
      enum: itineraryContractTypes
    }
  )
  contract_type: itineraryContractTypes;

  @Column()
  period: schoolPeriods;

  @Column(
    {
      type: "enum",
      enum: passengerStatusTypes,
      default: passengerStatusTypes.ongoing,
    }
  )
  status: passengerStatusTypes;

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
