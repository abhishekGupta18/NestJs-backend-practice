import { DBService } from '@db/db.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpDbService } from './otp/otp-db.service';
import { OtpDbRepository } from './otp/otp-db.repository';
import { AuthDbRepository } from './auth/auth-db.repository';
import { AuthDbService } from './auth/auth-db.service';
import { ProductsDbRepository } from './products/products-db.repository';
import { ProductsDbService } from './products/products-db.service';
import { CategoriesDbService } from './categories/categories-db.service';
import { CategoriesDbRepository } from './categories/categoroies-db.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DBService, OtpDbService,OtpDbRepository,AuthDbRepository,AuthDbService, ProductsDbRepository, ProductsDbService, CategoriesDbService, CategoriesDbRepository],
  exports: [DBService, OtpDbService,AuthDbService, ProductsDbService, CategoriesDbService],
})
export class DBModule {}
