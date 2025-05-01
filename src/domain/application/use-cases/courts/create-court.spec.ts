import { InMemoryCourtRepository } from "test/repositories/in-memory-court-repository";
import { Court } from "@/domain/enterprise/entities/court/court";
import { CreateCourtUseCase } from "./create-court";
import { CourtTypeEnum } from "@/domain/enterprise/entities/court/enum/court-type.enum";
import { makeEstablishment } from "test/factories/make-establishment";
import { InMemoryEstablishmentRepository } from "test/repositories/in-memory-establishment-repository";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { CourtLocationTypeEnum } from "@/domain/enterprise/entities/court/enum/court-location-type.enum";

let inMemoryCourtRepository: InMemoryCourtRepository;
let inMemoryEstablishmentRepository: InMemoryEstablishmentRepository;
let sut: CreateCourtUseCase;

describe("Create Court", () => {
  beforeEach(async () => {
    inMemoryEstablishmentRepository = new InMemoryEstablishmentRepository();
    inMemoryCourtRepository = new InMemoryCourtRepository();
    sut = new CreateCourtUseCase(
      inMemoryCourtRepository,
      inMemoryEstablishmentRepository
    );
  });

  it("should be able to create an court", async () => {
    const establishment = makeEstablishment();
    await inMemoryEstablishmentRepository.create(establishment);

    const result = await sut.execute({
      name: "Quadra 1",
      type: CourtTypeEnum.FUTSAL,
      establishmentId: establishment.id.toString(),
      locationType: CourtLocationTypeEnum.COVERED,
      bookingDurationMinutes: 30,
    });

    expect(result.isSuccess()).toBe(true);

    const { court } = result.value as { court: Court };

    expect(court).toEqual(
      expect.objectContaining({
        name: "Quadra 1",
        type: CourtTypeEnum.FUTSAL,
        establishmentId: establishment.id,
        createdAt: expect.any(Date),
      })
    );
  });

  it("should not be able to create an court with non existent establishment", async () => {
    const result = await sut.execute({
      name: "Quadra 1",
      type: CourtTypeEnum.FUTSAL,
      establishmentId: "inexistent-id",
      locationType: CourtLocationTypeEnum.COVERED,
      bookingDurationMinutes: 30,
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
