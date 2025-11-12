import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./product/product.module";
import { Product } from "./product/models/product";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [`${__dirname}/**/models/**/!(*.test).{ts,js}`],
      synchronize: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}
