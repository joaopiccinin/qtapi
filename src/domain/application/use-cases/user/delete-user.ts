import { UserRepository } from "../../repositories/user-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { UserEstablishmentRepository } from "../../repositories/user-establishment-repository";
import { UserEstablishment } from "@/domain/enterprise/entities/relationships/user-establishment";

interface DeleteUserUseCaseRequest {
  userId: string;
  establishmentId: string;
}

type DeleteUserResponse = Either<ResourceNotFoundError, {}>;

export class DeleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userEstablishmentRepository: UserEstablishmentRepository
  ) {}

  async execute(
    request: DeleteUserUseCaseRequest
  ): Promise<DeleteUserResponse> {
    const user = await this.userRepository.findById(request.userId);

    if (!user) {
      return failure(new ResourceNotFoundError());
    }

    await this.userRepository.delete(user);

    const userEstablishment =
      (await this.userEstablishmentRepository.findByUserIdAndEstablishmentId(
        request.userId,
        request.establishmentId
      )) as UserEstablishment;

    await this.userEstablishmentRepository.delete(userEstablishment);

    return success({});
  }
}
