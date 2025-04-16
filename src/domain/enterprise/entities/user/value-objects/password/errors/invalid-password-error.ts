import { valueObjectError } from "@/core/errors/value-objects/value-object-error";

export class InvalidPasswordError extends Error implements valueObjectError {
  constructor() {
    super("Password is invalid.");
  }
}
