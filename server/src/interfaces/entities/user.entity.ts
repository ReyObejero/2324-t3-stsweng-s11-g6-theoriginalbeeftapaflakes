export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export type UserRole = (typeof userRoles)[number];

const userRoles = ['USER', 'ADMIN'] as const;
