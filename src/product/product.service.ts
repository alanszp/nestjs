import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./models/Product";
import { CreateProductInput } from "./models/inputs/CreateProductInput";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(input: CreateProductInput): Promise<Product> {
    await input.validate();
    const toBeCreated = new Product().fromInput(input);
    return this.productRepository.save(toBeCreated);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
