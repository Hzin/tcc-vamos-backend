import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import Itinerary from './Itinerary';
import User from './User';

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
  document_status: boolean

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

  @ManyToOne(() => User, user => user.vehicle)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Itinerary, itinerary => itinerary.vehicle, { eager: true, cascade: true, nullable: true })
  itineraries?: Itinerary[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Vehicle;
