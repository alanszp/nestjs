import { validate } from "class-validator";
import { ModelValidationError } from "../../errors/ModelValidationError";
import {
  BaseEntity as TypeOrmBaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  public async validate(): Promise<void> {
    const validationResult = await validate(this);

    if (validationResult.length > 0) {
      return Promise.reject(new ModelValidationError(validationResult));
    }
    return Promise.resolve();
  }
}
