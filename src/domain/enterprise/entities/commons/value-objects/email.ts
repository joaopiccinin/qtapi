import { Either, failure, success } from "@/core/either";
import validator from "validator";
import { InvalidEmailError } from "./errors/invalid-email-error";

export interface EmailProps {
  email: string;
}

type CreateEmailResponse = Either<
  InvalidEmailError,
  {
    email: Email;
  }
>;

export class Email {
  private email: string;

  public constructor(email: string) {
    this.email = email;
  }

  static create({ email }: EmailProps): CreateEmailResponse {
    if (!Email.isEmailValid(email)) {
      return failure(new InvalidEmailError());
    }

    const hashedEmail = new Email(email);

    return success({ email: hashedEmail });
  }

  toString(): string {
    return this.email;
  }

  /**
   * Validates an email address using the `validator` library.
   *
   * This function leverages the `validator.isEmail()` method, which performs a comprehensive check for email format.
   *
   * @param email - The email address to validate.
   * @returns `true` if the email is valid, `false` otherwise.
   */
  static isEmailValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
