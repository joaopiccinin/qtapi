import { EstablishmentRepository } from "../../repositories/establishment-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";

export interface UpdateEstablishmentUseCaseRequest {
  name: string;
  phone: string;
}

type UpdateEstablishmentResponse = Either<ResourceNotFoundError, {}>;

export class UpdateEstablishmentUseCase {
  constructor(private establishmentRepository: EstablishmentRepository) {}

  async execute(id: string, request: UpdateEstablishmentUseCaseRequest): Promise<UpdateEstablishmentResponse> {
    const establishment = await this.establishmentRepository.findById(id);

    if (!establishment) {
      return failure(new ResourceNotFoundError());
    }

    await this.establishmentRepository.update(establishment, request);

    return success({});
  }
}
