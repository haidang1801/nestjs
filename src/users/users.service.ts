import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { RegisterUserDto } from './dtos/registerUser.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    create(requestBody: RegisterUserDto) {
        const user = this.userRepo.create(requestBody);
        return this.userRepo.save(user);
    }

    findAll() {
        return this.userRepo.find();
    }

    findById(id: number) {
        return this.userRepo.findOneBy({id});
    }

    findByEmail(email: string) {
        return this.userRepo.findOneBy({email});
    }

    async updateById(id: number, requestBody: UpdateUserDto) {
        let user = await this.findById(id);

        if(!user) {
            throw new NotFoundException('User does not exist');
        }
        
        user = {...user, ...requestBody }
        return this.userRepo.save(user);
    }

    async deleteById(id: number) {
        const user = await this.findById(id);

        if(!user) {
            throw new NotFoundException('User does not exist');
        }

        return this.userRepo.remove(user);
    }

    async setCurrentRefreshToken(refreshToken: string, id: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepo.update(id, {
            currentHashedRefreshToken
        });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
        const user = await this.findById(id);
        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.currentHashedRefreshToken
        );

        if(isRefreshTokenMatching) {
            return user;
        }
    }
}
