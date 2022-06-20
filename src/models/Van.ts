import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('vans')
class Van {
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Van;
