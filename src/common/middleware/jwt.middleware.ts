import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtPayload, RequestUserKey } from '../constants';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
	constructor(private readonly jwtService: JwtService) {}
	use(req: Request, res: Response, next: () => void) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, token] = req.headers.authorization?.split(' ') || [];
		req[RequestUserKey] = this.jwtService.decode<JwtPayload>(token);
		next();
	}
}
