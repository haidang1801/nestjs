import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';

enum ROLES {
    ADMIN = 'ADMIN',
    MOD = 'MOD',
    USER = 'USER'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        type: "enum",
        enum: ROLES,
        default: ROLES.USER
    })
    @Exclude()
    role: ROLES;

    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @Column({
        nullable: true
    })
    currentHashedRefreshToken?: string;
}