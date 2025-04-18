import { InMemoryCourtRepository } from "test/repositories/in-memory-court-repository";
import { UpdateCourtUseCase } from "./update-court";
import { makeCourt } from "test/factories/make-court";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { CourtTypeEnum } from "@/domain/enterprise/entities/court/enum/court-type.enum";
import { Court } from "@/domain/enterprise/entities/court/court";

let inMemoryCourtRepository: InMemoryCourtRepository;
let sut: UpdateCourtUseCase;

describe("Update Court", () => {
  beforeEach(() => {
    inMemoryCourtRepository = new InMemoryCourtRepository();
    sut = new UpdateCourtUseCase(inMemoryCourtRepository);
  });

  it("should be able to update an court", async () => {
    const court = makeCourt();
    await inMemoryCourtRepository.create(court);

    const result = await sut.execute(court.id.toString(), {
      name: "Quadra atualizada",
      type: CourtTypeEnum.FUTSAL,
    });

    expect(result.isSuccess()).toBe(true);

    const updatedCourt = (await inMemoryCourtRepository.findById(
      court.id.toString()
    )) as Court;

    expect(updatedCourt).toEqual(
      expect.objectContaining({
        name: "Quadra atualizada",
        type: CourtTypeEnum.FUTSAL,
        establishmentId: updatedCourt.establishmentId,
        createdAt: expect.any(Date),
      })
    );
  });

  it("should not be able to update an court if it does not exist", async () => {
    const result = await sut.execute("inexistent-court", {
      name: "Quadra atualizada",
      type: CourtTypeEnum.FUTSAL,
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
