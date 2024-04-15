import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
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
		const payload = { sub: user.id, email: user.email };
		return { accessToken: await this.jwtService.signAsync(payload) };
	}
}
