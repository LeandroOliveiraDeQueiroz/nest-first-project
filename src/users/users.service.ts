import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Avatar } from './entities/avatar.entity';
import { Model } from 'mongoose';
import {
  createEmailOptions,
  createTransporter,
} from 'src/utils/nodemailer/nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Avatar.name) private avatarModel: Model<Avatar>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const { id, email, first_name, last_name, avatar } = createUserDto;
    const createdUser = new this.userModel({
      reqresId: id,
      email: email,
      firstName: first_name,
      lastName: last_name,
      avatarUrl: avatar,
    });
    return createdUser.save();
  }

  sendCreateEmail(name: string, email: string) {
    const transporter = createTransporter();
    return transporter.sendMail(
      createEmailOptions({
        receiver: email,
        subject: 'Create User',
        text: `Hey ${name}, your user was created successfully`,
      }),
    );
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      const { data } = await axios.get(
        `${process.env.FAKE_DATA_URL}/users/${id}`,
      );

      return data?.data;
    } catch (error) {
      return error;
    }
  }

  findOneOnDB(id: string) {
    return this.userModel.findOne({ reqresId: +id });
  }

  async saveAvatar(user: User) {
    try {
      const { data } = await axios.get(`${user.avatarUrl}`, {
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(data, 'binary');

      const hash = crypto.createHash('md5').update(data).digest('hex');

      const createdAvatar = new this.avatarModel({
        image: buffer,
        user: user,
        hash: hash,
      });

      const avatar = await createdAvatar.save();

      return avatar;
    } catch (error) {
      console.error(error);
      throw new Error('Could not save the image');
    }
  }

  async removeAvatar(id: string) {
    const user = await this.userModel.findOne({ reqresId: +id });
    const avatar = await this.avatarModel.findOneAndDelete({
      user: user,
    });
    return avatar;
  }
}
