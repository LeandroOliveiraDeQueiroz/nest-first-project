import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.entity';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
  user: User;

  @Prop()
  hash: string;

  @Prop()
  image: Buffer;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
