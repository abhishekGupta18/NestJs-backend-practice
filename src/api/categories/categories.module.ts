import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { Module } from "@nestjs/common";
import { DBModule } from "@db/db.module";

@Module({
    imports: [DBModule],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}