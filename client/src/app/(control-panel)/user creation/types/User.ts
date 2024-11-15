export type User = {
    id: string;
    email: string;
    division: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
};

export type UserCreationState = {
    users: User[];
    loading: boolean;
    error: string | null;
};
