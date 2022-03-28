import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { MessageDTO } from './dto/index';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

    async saveMessage(dto: MessageDTO): Promise<Message | boolean> {
        try {
            const message = await this.messageModel.create(dto);

            return message;
        } catch(error) {
            return false;
        }
    }
}
