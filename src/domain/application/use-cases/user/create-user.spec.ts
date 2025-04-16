import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository";
import { CreateUserUseCase } from "./create-user";
import { PasswordMismatchError } from "@/domain/enterprise/entities/user/value-objects/password/errors/password-mismatch-error";
import { InvalidPasswordError } from "@/domain/enterprise/entities/user/value-objects/password/errors/invalid-password-error";
import { makeUser } from "test/factories/make-user";
import { User } from "@/domain/enterprise/entities/user/user";
import { InvalidEmailError } from "@/domain/enterprise/entities/commons/value-objects/errors/invalid-email-error";
import { EmailAlreadyInUseError } from "../commons/errors/email-already-in-use-error";
import { makeEstablishment } from "test/factories/make-establishment";
import { InMemoryuserEstablishmentRepository } from "test/repositories/in-memory-user-establishment-repository";
import { InMemoryEstablishmentRepository } from "test/repositories/in-memory-establishment-repository";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { Establishment } from "@/domain/enterprise/entities/establishment/establishment";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryUserEstablishmentRepository: InMemoryuserEstablishmentRepository;
let inMemoryEstablishmentRepository: InMemoryEstablishmentRepository;
let sut: CreateUserUseCase;
let establishment: Establishment;

async function createEstablishment(): Promise<Establishment> {
  const establishment = makeEstablishment();
  await inMemoryEstablishmentRepository.create(establishment);
  return establishment;
}

describe("Create User", () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryUserEstablishmentRepository =
      new InMemoryuserEstablishmentRepository();
    inMemoryEstablishmentRepository = new InMemoryEstablishmentRepository();

    sut = new CreateUserUseCase(
      inMemoryUserRepository,
      inMemoryUserEstablishmentRepository,
      inMemoryEstablishmentRepository
    );

    establishment = await createEstablishment();
  });

  it("should be able to create an user", async () => {
    const result = await sut.execute({
      name: "João",
      email: "joao@gmail.com",
      phone: "123456789",
      establishmentId: establishment.id.toString(),
      password: "12345Joao#",
      passwordConfirmation: "12345Joao#",
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUserEstablishmentRepository.items.length).toBe(1);

    const { user } = result.value as { user: User };

    expect(user).toEqual(
      expect.objectContaining({
        name: "João",
        email: "joao@gmail.com",
        phone: "123456789",
        passwordHash: expect.any(String),
        createdAt: expect.any(Date),
      })
    );
  });

  it("should not be able to create an user if passwords do not match", async () => {
    const result = await sut.execute({
      name: "João",
      email: "joao@gmail.com",
      phone: "123456789",
      establishmentId: establishment.id.toString(),
      password: "12345Joao#",
      passwordConfirmation: "12345Joao##",
    });

    expect(result.isFailure()).toBe(true);
    expect(inMemoryUserEstablishmentRepository.items.length).toBe(0);
    expect(result.value).toBeInstanceOf(PasswordMismatchError);
  });

  it("should not be able to create an user if passwords is invalid", async () => {
    const result = await sut.execute({
      name: "João",
      email: "joao@gmail.com",
      phone: "123456789",
      establishmentId: establishment.id.toString(),
      password: "12345",
      passwordConfirmation: "12345",
    });

    expect(result.isFailure()).toBe(true);
    expect(inMemoryUserEstablishmentRepository.items.length).toBe(0);
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });

  it("should not be able to create an user with an email that is already in use", async () => {
    const user = makeUser({ email: "joao@gmail.com" });
    await inMemoryUserRepository.create(user);

    const result = await sut.execute({
      name: "João",
      email: "joao@gmail.com",
      phone: "123456789",
      establishmentId: establishment.id.toString(),
      password: "12345Joao#",
      passwordConfirmation: "12345Joao#",
    });

    expect(result.isFailure()).toBe(true);
    expect(inMemoryUserEstablishmentRepository.items.length).toBe(0);
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError);
  });

  it("should not be able to create an user with an invalid email", async () => {
    const result = await sut.execute({
      name: "João",
      email: "joaogmail.com",
      phone: "123456789",
      establishmentId: establishment.id.toString(),
      password: "12345Joao#",
      passwordConfirmation: "12345Joao#",
    });

    expect(result.isFailure()).toBe(true);
    expect(inMemoryUserEstablishmentRepository.items.length).toBe(0);
    expect(result.value).toBeInstanceOf(InvalidEmailError);
  });

  it("should not be able to create an user with an invalid establishment id", async () => {
    const result = await sut.execute({
      name: "João",
      email: "joao@gmail.com",
      phone: "123456789",
      establishmentId: "inexistent-establishment",
      password: "12345Joao#",
      passwordConfirmation: "12345Joao#",
    });

    expect(result.isFailure()).toBe(true);
    expect(inMemoryUserEstablishmentRepository.items.length).toBe(0);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
