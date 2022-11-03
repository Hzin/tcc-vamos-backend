import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { itineraryContractTypes } from '../../constants/itineraryContractTypes';
import { passengerStatusTypes } from '../../constants/passengerStatusTypes';

import Utils from '../../services/utils/Utils';

export class CreatePassengers1660010452826 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'passengers',
        columns: [
          {
            name: 'id_passenger',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'itinerary_id',
            type: 'integer',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'contract_type',
            type: 'enum',
            enum: Utils.convertEnumValuesToStringArray(itineraryContractTypes)
          },
          {
            name: 'status',
            type: 'enum',
            enum: Utils.convertEnumValuesToStringArray(passengerStatusTypes),
            default: passengerStatusTypes.ongoing
          },
          {
            name: 'lat_origin',
            type: 'numeric',
          },
          {
            name: 'lng_origin',
            type: 'numeric',
          },
          {
            name: 'formatted_address_origin',
            type: 'varchar',
          },
          {
            name: 'lat_destination',
            type: 'numeric',
          },
          {
            name: 'lng_destination',
            type: 'numeric',
          },
          {
            name: 'formatted_address_destination',
            type: 'varchar',
          },
          {
            name: 'payment_status',
            type: 'boolean',
          },
          {
            name: 'start_date',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'passengers',
      new TableForeignKey({
        name: 'passengers_itinerary_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['itinerary_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_itinerary'], // coluna PK da tabela referenciada
        referencedTableName: 'itineraries', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'passengers',
      new TableForeignKey({
        name: 'passengers_user_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da tabela referenciada
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'passengers',
      new TableIndex({
        name: 'passengers_itinerary_user_idx',
        columnNames: ['itinerary_id', 'user_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('passengers');
    await queryRunner.dropForeignKey(
      'passengers',
      'passengers_itinerary_id_fk',
    );
    await queryRunner.dropForeignKey('passengers', 'passengers_user_id_fk');
    await queryRunner.dropIndex('passengers', 'passengers_itinerary_user_idx');
  }
}
