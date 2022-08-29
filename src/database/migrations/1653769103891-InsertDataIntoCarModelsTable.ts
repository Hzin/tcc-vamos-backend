import { getConnection, MigrationInterface, QueryRunner } from "typeorm";

import carModels from '../../constants/carModels'
import CarModels from "../../models/CarModels";

export class InsertDataIntoCarModelsTable1653769103891 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        carModels.forEach(async (car) => {
            const GBP = await queryRunner.manager.save(queryRunner.manager.create<CarModels>(CarModels, { name: car.name }))
            }
        )}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(CarModels)
            .execute();
    }
}
