import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import Vehicle from './Vehicle';

@Entity('vehicles_documents')
class VehicleDocument {
  @PrimaryGeneratedColumn('increment')
  id_vehicles_documents: number;

  @ManyToOne(() => Vehicle, vehicle => vehicle.documents)
  @JoinColumn({ name: 'vehicle_plate' })
  vehicle: Vehicle;

  @Column()
  document_type: string;

  @Column({ nullable: true })
  path: string;

  @Column()
  isApproved: boolean

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VehicleDocument;
