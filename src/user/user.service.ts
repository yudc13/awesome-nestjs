import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * 创建用户
	 * @param createUserDto
	 */
	async create(createUserDto: CreateUserDto) {
		try {
			const { email, password } = createUserDto;
			const createUserInput = {
				email,
				password,
				createAt: new Date(),
			};
			return await this.prismaService.user.create({ data: createUserInput });
		} catch (e) {
			return null;
		}
	}

	/**
	 * 根据email查询用户信息
	 * @param email
	 */
	async findUserByEmail(email: string) {
		return this.prismaService.user.findUnique({ where: { email } });
	}
}
