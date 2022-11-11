import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { tripStatus } from "../../constants/tripStatus";

import Utils from '../../services/utils/Utils';

export class CreateTripsHistoryTable1663372568541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trips_history',
        columns: [
          {
            name: 'id_trips_history',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'trip_id',
            type: 'integer',
          },
          {
            name: 'old_status',
            type: 'enum',
            enum: Utils.convertEnumValuesToStringArray(tripStatus),
            isNullable: true
          },
          {
            name: 'new_status',
            type: 'enum',
            enum: Utils.convertEnumValuesToStringArray(tripStatus)
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'trips_history',
      new TableForeignKey({
        name: 'trips_history_trip_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['trip_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_trip'], // coluna PK da tabela referenciada
        referencedTableName: 'trips', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('trips_history', 'trips_history_trip_id_fk');
    await queryRunner.dropTable('trips_history');
  }
}
