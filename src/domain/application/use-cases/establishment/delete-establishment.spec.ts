import { InMemoryEstablishmentRepository } from "test/repositories/in-memory-establishment-repository";
import { DeleteEstablishmentUseCase } from "./delete-establishment";
import { makeEstablishment } from "test/factories/make-establishment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { InMemoryuserEstablishmentRepository } from "test/repositories/in-memory-user-establishment-repository";
import { makeUserEstablishment } from "test/factories/make-user-establishment";

let inMemoryEstablishmentRepository: InMemoryEstablishmentRepository;
let inMemoryUserEstablishmentRepository: InMemoryuserEstablishmentRepository;
let sut: DeleteEstablishmentUseCase;

describe("Delete Establishment", () => {
  beforeEach(() => {
    inMemoryEstablishmentRepository = new InMemoryEstablishmentRepository();
    inMemoryUserEstablishmentRepository =
      new InMemoryuserEstablishmentRepository();
    sut = new DeleteEstablishmentUseCase(
      inMemoryEstablishmentRepository,
      inMemoryUserEstablishmentRepository
    );
  });

  it("should be able to delete an establishment", async () => {
    const establishment = makeEstablishment(
      {},
      new UniqueEntityID("establishment-1")
    );
    await inMemoryEstablishmentRepository.create(establishment);

    const result = await sut.execute({ id: establishment.id.toString() });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryEstablishmentRepository.items.length).toBe(0);
  });

  it("should not be able to delete an establishment if it does not exist", async () => {
    const result = await sut.execute({ id: "inexistent-establishment" });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to delete an establishment and all related user establishments", async () => {
    const establishment = makeEstablishment(
      {},
      new UniqueEntityID("establishment-1")
    );
    const userEstablishment = makeUserEstablishment({
      userId: new UniqueEntityID("user-1"),
      establishmentId: establishment.id,
      createdAt: new Date(),
    });

    await inMemoryEstablishmentRepository.create(establishment);
    await inMemoryUserEstablishmentRepository.create(userEstablishment);

    const result = await sut.execute({
      id: establishment.id.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryEstablishmentRepository.items.length).toBe(0);
  })
});
