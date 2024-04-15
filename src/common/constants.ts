export const RequestUserKey = 'user';

export type JwtPayload = {
	userId: number;
	email: string;
	iat: number;
	exp: number;
};
