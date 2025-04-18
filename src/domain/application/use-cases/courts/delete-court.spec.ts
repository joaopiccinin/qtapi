import { InMemoryCourtRepository } from "test/repositories/in-memory-court-repository";
import { DeleteCourtUseCase } from "./delete-court";
import { makeCourt } from "test/factories/make-court";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";

let inMemoryCourtRepository: InMemoryCourtRepository;
let sut: DeleteCourtUseCase;

describe("Delete Court", () => {
  beforeEach(() => {
    inMemoryCourtRepository = new InMemoryCourtRepository();
    sut = new DeleteCourtUseCase(inMemoryCourtRepository);
  });

  it("should be able to delete an court", async () => {
    const court = makeCourt({}, new UniqueEntityID("court-1"));
    await inMemoryCourtRepository.create(court);

    const result = await sut.execute({ id: court.id.toString() });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryCourtRepository.items.length).toBe(0);
  });

  it("should not be able to delete an court if it does not exist", async () => {
    const result = await sut.execute({ id: "inexistent-court" });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
