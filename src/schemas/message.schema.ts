import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema({timestamps: true})
export class Message {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    from: User;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    to: User;

    @Prop({required: true})
    message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);