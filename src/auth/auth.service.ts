import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { SignupDto } from './dto';
import { UserDocument } from '../user/user.schema';
import { hash } from 'argon2';

@Injectable({})
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async signup(dto: SignupDto) {

        const user = await this.userModel.findOne({ email: dto.email });

        if (user)
            throw new ConflictException('Email already exists');

        const passwordHash = await hash(dto.password);
        dto.password = passwordHash;
        
        const newUser = await this.userModel.create(dto);

        return newUser;
    }

    signin() {
        return {msg: 'Hello world'}
    }
}