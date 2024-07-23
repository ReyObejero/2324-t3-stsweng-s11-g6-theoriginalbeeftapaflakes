import { UserRole } from '../../interfaces/entities';

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        userId: number;
        role: UserRole;
    }
}
