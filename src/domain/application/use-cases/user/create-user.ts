import { User } from "@/domain/enterprise/entities/user/user";
import { UserRepository } from "../../repositories/user-repository";
import { Password } from "@/domain/enterprise/entities/user/value-objects/password/password";
import { Either, failure, success } from "@/core/either";
import { PasswordMismatchError } from "@/domain/enterprise/entities/user/value-objects/password/errors/password-mismatch-error";
import { Email } from "@/domain/enterprise/entities/commons/value-objects/email";
import { EmailAlreadyInUseError } from "../commons/errors/email-already-in-use-error";
import { InvalidPasswordError } from "@/domain/enterprise/entities/user/value-objects/password/errors/invalid-password-error";
import { InvalidEmailError } from "@/domain/enterprise/entities/commons/value-objects/errors/invalid-email-error";
import { UserEstablishment } from "@/domain/enterprise/entities/relationships/user-establishment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UserEstablishmentRepository } from "../../repositories/user-establishment-repository";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { EstablishmentRepository } from "../../repositories/establishment-repository";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  phone: string;
  establishmentId: string;
  password: string;
  passwordConfirmation: string;
}

type CreateUserResponse = Either<
  | PasswordMismatchError
  | EmailAlreadyInUseError
  | InvalidPasswordError
  | InvalidEmailError
  | ResourceNotFoundError,
  {
    user: User;
  }
>;

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userEstablishmentRepository: UserEstablishmentRepository,
    private establishmentRepository: EstablishmentRepository
  ) {}

  async execute(
    request: CreateUserUseCaseRequest
  ): Promise<CreateUserResponse> {
    const existingUserWithEmail = await this.userRepository.findByEmail(
      request.email
    );
    if (existingUserWithEmail) {
      return failure(new EmailAlreadyInUseError());
    }

    const existingEstablishment = await this.establishmentRepository.findById(
      request.establishmentId
    );
    if (!existingEstablishment) {
      return failure(new ResourceNotFoundError());
    }

    const emailResult = Email.create({ email: request.email });
    if (emailResult.isFailure()) {
      return failure(emailResult.value);
    }

    const email = emailResult.value.email;

    const passwordResult = Password.create({
      password: request.password,
      passwordConfirmation: request.passwordConfirmation,
    });

    if (passwordResult.isFailure()) {
      return failure(passwordResult.value);
    }

    const passwordHash = passwordResult.value.password;

    const user = User.create({
      name: request.name,
      email: email.toString(),
      phone: request.phone,
      passwordHash: passwordHash.toString(),
      createdAt: new Date(),
    });

    const userEstablishment = UserEstablishment.create({
      userId: user.id,
      establishmentId: new UniqueEntityID(request.establishmentId),
      createdAt: new Date(),
    });

    await this.userEstablishmentRepository.create(userEstablishment);
    await this.userRepository.create(user);

    return success({ user });
  }
}
