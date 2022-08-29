import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class DropCarBrandsTable1661745915711 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('carBrands')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'carModels',
          columns: [
            {
              name: 'id_brand',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
            }
          ],
        }),
      );
    }
}
