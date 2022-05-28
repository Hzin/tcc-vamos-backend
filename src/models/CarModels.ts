import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carModels')
class CarModels {
  @PrimaryGeneratedColumn('uuid')
  id_model: string;

  @Column()
  name: string;
}

export default CarModels;
