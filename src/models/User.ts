import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Passenger from './Passenger';
import PassengerRequest from './PassengerRequest';
import UserSearching from './UsersSearching';
import Vehicle from './Vehicle';

// unused
// import TransportOffers from './TransportOffers';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  birth_date: string;

  @Column()
  password: string;

  @Column()
  avatar_image: string;

  @Column()
  bio: string;

  @Column()
  star_rating: number;

  @Column()
  document_type: string;

  @Column()
  document: string;

  @OneToMany(() => Vehicle, vehicle => vehicle.user, { eager: true, cascade: true, nullable: true })
  vehicles?: Vehicle[];

  @OneToMany(() => UserSearching, userSearching => userSearching.user, { eager: true, cascade: true, nullable: true })
  usersSearching?: UserSearching[];

  // unused
  // @OneToMany(() => TransportOffers, transportOffers => transportOffers.user, { eager: true, cascade: true, nullable: true })
  // transportOffers?: TransportOffers[];

  @OneToMany(() => PassengerRequest, passengerRequest => passengerRequest.user, { eager: true, cascade: true, nullable: true })
  passengerRequest?: PassengerRequest[];

  @OneToMany(() => Passenger, passenger => passenger.user, { eager: true, cascade: true, nullable: true })
  passengers?: Passenger[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
