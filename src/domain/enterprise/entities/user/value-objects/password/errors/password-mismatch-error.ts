import { valueObjectError } from "@/core/errors/value-objects/value-object-error";

export class PasswordMismatchError extends Error implements valueObjectError {
  constructor() {
    super("Password and password confirmation do not match.");
  }
}
