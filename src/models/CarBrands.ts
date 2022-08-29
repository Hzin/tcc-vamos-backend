import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carBrands')
class CarBrands {
  @PrimaryGeneratedColumn('uuid')
  id_brand: string;

  @Column()
  name: string;
}

export default CarBrands;
