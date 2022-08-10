import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateDestinations1660009323138 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'destinations',
        columns: [
          {
            name: 'id_destination',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'route_id',
            type: 'integer',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'latitude',
            type: 'numeric',
          },
          {
            name: 'longitude',
            type: 'numeric',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'destinations',
      new TableForeignKey({
        name: 'destinations_route_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['route_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_route'], // coluna PK da tabela referenciada
        referencedTableName: 'routes', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('destinations');
    await queryRunner.dropForeignKey('destinations', 'destinations_route_id_fk');
  }
}
