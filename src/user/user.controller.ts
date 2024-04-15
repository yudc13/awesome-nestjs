import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { JwtPayload } from '../common/constants';
import { User } from '../common/decorator/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getUserList(@User() user: JwtPayload) {
		console.log({ user });
		return this.userService.findUserList();
	}
	@HttpCode(HttpStatus.OK)
	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
}
