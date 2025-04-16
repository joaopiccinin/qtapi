import { Email } from "./email";
import { InvalidEmailError } from "./errors/invalid-email-error";

describe("Creating a email ", () => {
  it("should be able to create new valid email hash", () => {
    const result = Email.create({
      email: "joao@gmail.com",
    });

    expect(result.isSuccess()).toBe(true);

    const { email } = result.value as { email: Email };
    expect(email.toString()).toBe("joao@gmail.com");
  });

  it("should not be able to create new email hash if email is invalid", () => {
    const result = Email.create({
      email: "joaogmail.com",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailError);
  });
});
