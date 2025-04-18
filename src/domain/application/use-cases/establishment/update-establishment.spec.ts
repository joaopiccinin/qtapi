import { InMemoryEstablishmentRepository } from "test/repositories/in-memory-establishment-repository";
import { UpdateEstablishmentUseCase } from "./update-establishment";
import { makeEstablishment } from "test/factories/make-establishment";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { Establishment } from "@/domain/enterprise/entities/establishment/establishment";

let inMemoryEstablishmentRepository: InMemoryEstablishmentRepository;
let sut: UpdateEstablishmentUseCase;

describe("Update Establishment", () => {
  beforeEach(() => {
    inMemoryEstablishmentRepository = new InMemoryEstablishmentRepository();
    sut = new UpdateEstablishmentUseCase(inMemoryEstablishmentRepository);
  });

  it("should be able to update an establishment", async () => {
    const establishment = makeEstablishment();
    await inMemoryEstablishmentRepository.create(establishment);

    const result = await sut.execute(establishment.id.toString(), {
      name: "Loja tal Atualizada",
      phone: "123456789",
    });

    expect(result.isSuccess()).toBe(true);

    const updatedEstablishment =
      (await inMemoryEstablishmentRepository.findById(
        establishment.id.toString()
      )) as Establishment;

    expect(updatedEstablishment).toEqual(
      expect.objectContaining({
        name: "Loja tal Atualizada",
        email: establishment.email,
        phone: "123456789",
        createdAt: expect.any(Date),
      })
    );
  });

  it("should not be able to update an establishment if it does not exist", async () => {
    const result = await sut.execute("inexistent-establishment", {
      name: "Loja tal Atualizada",
      phone: "123456789",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
