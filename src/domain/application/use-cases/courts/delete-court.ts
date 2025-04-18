import { CourtRepository } from "../../repositories/court-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";

interface DeleteCourtUseCaseRequest {
  id: string;
}

type DeleteCourtResponse = Either<ResourceNotFoundError, {}>;

export class DeleteCourtUseCase {
  constructor(private courtRepository: CourtRepository) {}

  async execute(
    request: DeleteCourtUseCaseRequest
  ): Promise<DeleteCourtResponse> {
    const court = await this.courtRepository.findById(request.id);

    if (!court) {
      return failure(new ResourceNotFoundError());
    }

    await this.courtRepository.delete(court);

    return success({});
  }
}
