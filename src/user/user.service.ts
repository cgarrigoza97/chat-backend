import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor( @InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async changeUserConnectionStatus(id: string, isConnected: boolean): Promise<User> {
        const user = await this.userModel.findById(id);
        user.online = isConnected;
        await user.save();

        return user;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.userModel
            .find()
            .sort('-online');

        return users;
    }
}
