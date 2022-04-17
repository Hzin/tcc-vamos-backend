import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('items')
class Item {
  @PrimaryGeneratedColumn('increment')
  id_item: number;

  @Column()
  nome: string;

  @Column()
  tipo: string;

  @Column()
  asset: string;

  @Column()
  preco: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Item;
