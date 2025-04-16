import { EstablishmentRepository } from "../../repositories/establishment-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { UserEstablishmentRepository } from "../../repositories/user-establishment-repository";

interface DeleteEstablishmentUseCaseRequest {
  id: string;
}

type DeleteEstablishmentResponse = Either<ResourceNotFoundError, {}>;

export class DeleteEstablishmentUseCase {
  constructor(
    private establishmentRepository: EstablishmentRepository,
    private userEstablishmentRepository: UserEstablishmentRepository
  ) {}

  async execute(
    request: DeleteEstablishmentUseCaseRequest
  ): Promise<DeleteEstablishmentResponse> {
    const establishment = await this.establishmentRepository.findById(
      request.id
    );

    if (!establishment) {
      return failure(new ResourceNotFoundError());
    }

    await this.establishmentRepository.delete(establishment);
    await this.userEstablishmentRepository.deleteManyByEstablishmentId(
      establishment.id.toString()
    );

    return success({});
  }
}
