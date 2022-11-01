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

import User from './User';
import Itinerary from './Itinerary';
import VehicleDocument from './VehicleDocument';
import VehicleDocuments from './VehicleDocument';

@Entity('vehicles')
class Vehicle {
  @PrimaryColumn()
  plate: string;

  // serve para o pai (User) referenciar os seus veículos com a propriedade 'vehicles'
  // no entanto, não consigo referenciar o usuário de um veículo pela sua propriedade 'user'
  @ManyToOne(() => User, user => user.vehicles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // para sanar o problema de "não consigo referenciar o usuário de um veículo pela sua propriedade 'user'"
  // coloco essa simples coluna para ao menos saber qual o ID do usuário
  @Column()
  user_id: string;

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
