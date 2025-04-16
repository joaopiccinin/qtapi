import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository";
import { DeleteUserUseCase } from "./delete-user";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { InMemoryuserEstablishmentRepository } from "test/repositories/in-memory-user-establishment-repository";
import { makeEstablishment } from "test/factories/make-establishment";
import { makeUserEstablishment } from "test/factories/make-user-establishment";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryUserEstablishmentRepository: InMemoryuserEstablishmentRepository;
let Es
let sut: DeleteUserUseCase;

describe("Delete User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryUserEstablishmentRepository =
      new InMemoryuserEstablishmentRepository();
    sut = new DeleteUserUseCase(
      inMemoryUserRepository,
      inMemoryUserEstablishmentRepository
    );
  });

  it("should be able to delete an user", async () => {
    const user = makeUser({}, new UniqueEntityID("user-1"));
    const establishment = makeEstablishment(
      {},
      new UniqueEntityID("establishment-1")
    );
    const userEstablishment = makeUserEstablishment({
      userId: user.id,
      establishmentId: establishment.id,
      createdAt: new Date(),
    });

    await inMemoryUserRepository.create(user);
    await inMemoryUserEstablishmentRepository.create(userEstablishment);

    const result = await sut.execute({
      userId: user.id.toString(),
      establishmentId: establishment.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryUserRepository.items.length).toBe(0);
    expect(inMemoryUserEstablishmentRepository.items.length).toBe(0);
  });

  it("should not be able to delete an user if it does not exist", async () => {
    const establishment = makeEstablishment(
      {},
      new UniqueEntityID("establishment-1")
    );
    const result = await sut.execute({
      userId: "inexistent-user",
      establishmentId: establishment.id.toString(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
