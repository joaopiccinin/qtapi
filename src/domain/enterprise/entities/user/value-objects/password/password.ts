import bcrypt from "bcrypt";
import { PasswordMismatchError } from "./errors/password-mismatch-error";
import { InvalidPasswordError } from "./errors/invalid-password-error";
import { Either, failure, success } from "@/core/either";

export interface PasswordProps {
  password: string;
  passwordConfirmation: string;
}

type CreatePasswordResponse = Either<
  PasswordMismatchError | InvalidPasswordError,
  {
    password: Password;
  }
>;

export class Password {
  private password: string;

  public constructor(password: string) {
    this.password = bcrypt.hashSync(password, 10);
  }

  static create({
    password,
    passwordConfirmation,
  }: PasswordProps): CreatePasswordResponse {
    if (!Password.doPasswordsMatch(password, passwordConfirmation)) {
      return failure(new PasswordMismatchError());
    }

    if (!Password.isPasswordValid(password)) {
      return failure(new InvalidPasswordError());
    }

    const hashedPassword = new Password(password);

    return success({ password: hashedPassword });
  }

  toString(): string {
    return this.password;
  }

  /**
   * Validates if a password meets the required criteria:
   * - At least one uppercase letter.
   * - At least one number.
   * - At least one special character.
   * - Minimum 8 characters.
   *
   * @returns boolean.
   */
  static isPasswordValid(password: string): boolean {
    const passwordRegex: RegExp =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    return passwordRegex.test(password);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  static doPasswordsMatch(
    password: string,
    passwordConfirmation: string
  ): boolean {
    return password === passwordConfirmation;
  }
}
