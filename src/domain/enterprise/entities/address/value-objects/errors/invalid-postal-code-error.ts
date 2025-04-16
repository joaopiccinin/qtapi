import { valueObjectError } from "@/core/errors/value-objects/value-object-error";

export class InvalidPostalCodeError extends Error implements valueObjectError {
  constructor() {
    super("PostalCode is invalid.");
  }
}
