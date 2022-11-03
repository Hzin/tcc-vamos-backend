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
import { vehicleDocumentTypes } from '../constants/vehicleDocumentTypes';
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

  @Column(
    {
      type: "enum",
      enum: vehicleDocumentTypes,
    }
  )
  document_type: vehicleDocumentTypes;

  @Column({ nullable: true })
  path: string;

  @Column(
    {
      type: "enum",
      enum: vehicleDocumentStatus,
      default: vehicleDocumentStatus.pending
    }
  )
  status: vehicleDocumentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VehicleDocument;
