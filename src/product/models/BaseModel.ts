import { validate } from "class-validator";
import { ModelValidationError } from "../../errors/ModelValidationError";

export abstract class BaseModel {
  public async validate(): Promise<void> {
    const validationResult = await validate(this);

    if (validationResult.length > 0) {
      return Promise.reject(new ModelValidationError(validationResult));
    }
    return Promise.resolve();
  }
}
