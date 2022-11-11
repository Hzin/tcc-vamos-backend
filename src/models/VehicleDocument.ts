import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { VehicleDocumentStatus } from '../enums/VehicleDocumentStatus';
import { VehicleDocumentType } from '../enums/VehicleDocumentType';
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
      enum: VehicleDocument,
    }
  )
  document_type: VehicleDocumentType;

  @Column({ nullable: true })
  path: string;

  @Column(
    {
      type: "enum",
      enum: VehicleDocumentStatus,
      default: VehicleDocumentStatus.pending
    }
  )
  status: VehicleDocumentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VehicleDocument;
