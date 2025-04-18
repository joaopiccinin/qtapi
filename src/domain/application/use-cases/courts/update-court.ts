import { CourtRepository } from "../../repositories/court-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { CourtTypeEnum } from "@/domain/enterprise/entities/court/enum/court-type.enum";

export interface UpdateCourtUseCaseRequest {
  name: string;
  type: CourtTypeEnum;
}

type UpdateCourtResponse = Either<ResourceNotFoundError, {}>;

export class UpdateCourtUseCase {
  constructor(private courtRepository: CourtRepository) {}

  async execute(
    id: string,
    request: UpdateCourtUseCaseRequest
  ): Promise<UpdateCourtResponse> {
    const court = await this.courtRepository.findById(id);

    if (!court) {
      return failure(new ResourceNotFoundError());
    }

    await this.courtRepository.update(court, request);

    return success({});
  }
}
