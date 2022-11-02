import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity('transport_offers')
class TransportOffers {
  @PrimaryGeneratedColumn('increment')
  id_offer: string;

  // unused
  // @ManyToOne(() => User, user => user.transportOffers)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column()
  latitude_from: number;

  @Column()
  longitude_from: number;

  @Column()
  latitude_to: number;

  @Column()
  longitude_to: number;

  @CreateDateColumn()
  created_at: Date;
}

export default TransportOffers;
