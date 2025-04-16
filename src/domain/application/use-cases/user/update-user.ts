import { UserRepository } from "../../repositories/user-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";

export interface UpdateUserUseCaseRequest {
  name?: string;
  phone?: string;
}

type UpdateUserResponse = Either<ResourceNotFoundError, {}>;

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, request: UpdateUserUseCaseRequest): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return failure(new ResourceNotFoundError());
    }

    await this.userRepository.update(user, request);

    user.updatedAt = new Date();
    await this.userRepository.save(user);

    return success({});
  }
}
