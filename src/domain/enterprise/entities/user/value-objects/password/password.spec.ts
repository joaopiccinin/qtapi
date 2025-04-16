import { InvalidPasswordError } from "./errors/invalid-password-error";
import { PasswordMismatchError } from "./errors/password-mismatch-error";
import { Password } from "./password";

describe("Creating a password ", () => {
  it("should be able to create new valid password hash", () => {
    const result = Password.create({
      password: "12345Joao#",
      passwordConfirmation: "12345Joao#",
    });

    expect(result.isSuccess()).toBe(true);

    const { password } = result.value as { password: Password };
    expect(password.toString()).toEqual(expect.any(String));
  });

  it("should not be able to create new password hash if password is different than password confirmation", () => {
    const result = Password.create({
      password: "12345Joao#",
      passwordConfirmation: "12345Joao##",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(PasswordMismatchError);
  });

  it("should not be able to create new password hash if password is invalid", () => {
    const result = Password.create({
      password: "12345",
      passwordConfirmation: "12345",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });

  it("should be able to compare passwords", async () => {
    const password = Password.create({
      password: "12345Joao#",
      passwordConfirmation: "12345Joao#",
    });

    expect(password.isSuccess()).toBe(true);

    const { password: passwordHash } = password.value as {
      password: Password;
    };

    const result = await passwordHash.comparePassword("12345Joao#");

    expect(result).toBe(true);
  });
});
