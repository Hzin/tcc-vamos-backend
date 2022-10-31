import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import Itinerary from './Itinerary';
import User from './User';
import VehicleDocument from './VehicleDocument';
import VehicleDocuments from './VehicleDocument';

@Entity('vehicles')
class Vehicle {
  @PrimaryColumn()
  plate: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  seats_number: string;

  @Column()
  locator_name: string;

  @Column()
  locator_address: string;

  @Column()
  locator_complement: string;

  @Column()
  locator_city: string;

  @Column()
  locator_state: string;

  @Column()
  picture: string;

  // @ManyToOne(() => User, user => user.vehicle)
  @ManyToOne(() => User, user => user.vehicles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Itinerary, itinerary => itinerary.vehicle, { eager: true, cascade: true, nullable: true })
  itineraries?: Itinerary[];

  @OneToMany(() => VehicleDocument, vehicleDocuments => vehicleDocuments.vehicle, { eager: true, cascade: true, nullable: true })
  documents?: VehicleDocuments[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Vehicle;
