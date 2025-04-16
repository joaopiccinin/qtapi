import { UseCaseError } from "../../commons/errors/use-case-error";

export class InvalidAddressTypeError extends Error implements UseCaseError {
  constructor() {
    super("Address type is invalid.");
  }
}
