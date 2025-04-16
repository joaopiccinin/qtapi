import { valueObjectError } from "@/core/errors/value-objects/value-object-error";

export class InvalidEmailError extends Error implements valueObjectError{
  constructor() {
    super("Email is invalid.");
  }
}
