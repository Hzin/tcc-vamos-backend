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
import { vehicleDocumentStatus } from '../constants/vehicleDocumentStatus';
import Vehicle from './Vehicle';

@Entity('vehicles_documents')
class VehicleDocument {
  @PrimaryGeneratedColumn('increment')
  id_vehicles_documents: number;

  @ManyToOne(() => Vehicle, vehicle => vehicle.documents)
  @JoinColumn({ name: 'vehicle_plate' })
  vehicle: Vehicle;

  @Column()
  vehicle_plate: string;

  @Column()
  document_type: string;

  @Column({ nullable: true })
  path: string;

  @Column(
    {
      type: "enum",
      enum: vehicleDocumentStatus,
      nullable: true
    }
  )
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VehicleDocument;
