import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RequestUserKey } from '../constants';

/**
 * 获取请求头中的用户信息
 */
export const User = createParamDecorator(
	(key: keyof JwtPayload, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request[RequestUserKey];
		return user ? (key ? user[key] : user) : null;
	},
);
