import { ValidationError } from "class-validator";
import { isArray } from "lodash";
import { BaseError } from "./BaseError";

export interface ValidationObject {
  property: string;
  constraints: { [type: string]: string };
}

export class ModelValidationError extends BaseError {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Model Validation Error");
    this.errors = errors;
  }

  public static from(
    objects: ValidationObject | ValidationObject[]
  ): ModelValidationError {
    const arrayObjects = isArray(objects) ? objects : [objects];

    const validationErrors = arrayObjects.map((o) => {
      const validationError = new ValidationError();

      validationError.property = o.property;
      validationError.children = [];
      validationError.constraints = o.constraints;

      return validationError;
    });

    return new ModelValidationError(validationErrors);
  }

  public toJSON(): Record<string, unknown> {
    return {
      context: {
        errors: this.errors.map((e) => ({
          property: e.property,
          errors: e.constraints,
          children: e.children,
        })),
      },
      code: "model_validation_error",
      message: "Model validation error",
    };
  }
}
