import { Court } from "@/domain/enterprise/entities/court/court";
import { CourtRepository } from "../../repositories/court-repository";
import { CourtTypeEnum } from "@/domain/enterprise/entities/court/enum/court-type.enum";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { EstablishmentRepository } from "../../repositories/establishment-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CourtLocationTypeEnum } from "@/domain/enterprise/entities/court/enum/court-location-type.enum";

interface CreateCourtUseCaseRequest {
  name: string;
  type: CourtTypeEnum;
  establishmentId: string;
  bookingDurationMinutes: number;
  locationType: CourtLocationTypeEnum;
}

type CreateCourtResponse = Either<
  ResourceNotFoundError,
  {
    court: Court;
  }
>;

export class CreateCourtUseCase {
  constructor(
    private courtRepository: CourtRepository,
    private establishmentRepository: EstablishmentRepository
  ) {}

  async execute(
    request: CreateCourtUseCaseRequest
  ): Promise<CreateCourtResponse> {
    const existingEstablishment = await this.establishmentRepository.findById(
      request.establishmentId
    );
    if (!existingEstablishment) {
      return failure(new ResourceNotFoundError());
    }

    const court = Court.create({
      name: request.name,
      type: request.type,
      establishmentId: new UniqueEntityID(request.establishmentId),
      bookingDurationMinutes: request.bookingDurationMinutes,
      locationType: request.locationType,
      createdAt: new Date(),
    });

    await this.courtRepository.create(court);

    return success({ court });
  }
}
