import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload } from '../common/constants';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;
		const user = await this.userService.findUserByEmail(email);
		if (!user || user.password !== password) {
			throw new ForbiddenException(`用户名或密码错误`);
		}
		return await this.generatorTokens(user);
	}

	async refreshToken(refreshToken: string) {
		try {
			const payload = await this.jwtService.verifyAsync<JwtPayload>(
				refreshToken,
				{
					secret: jwtConstants.secret,
				},
			);
			const user = await this.userService.findUserByEmail(payload.email);
			return await this.generatorTokens(user);
		} catch (e) {
			throw new UnauthorizedException('非法Token');
		}
	}

	async generatorTokens(user: User) {
		const [accessToken, refreshToken] = await Promise.all([
			this.signToken(user.id, jwtConstants.expiresIn, { email: user.email }),
			this.signToken(user.id, jwtConstants.refreshExpiresIn, {
				email: user.email,
			}),
		]);
		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * token签名
	 * @param {number} userId - 用户ID
	 * @param {string | number} expiresIn - 过期时间
	 * @param payload - 载荷
	 */
	async signToken<T>(userId: number, expiresIn: string | number, payload?: T) {
		return await this.jwtService.signAsync(
			{
				userId,
				...payload,
			},
			{
				secret: jwtConstants.secret,
				expiresIn,
			},
		);
	}
}
