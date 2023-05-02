import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from 'src/utils/message.event';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      await this.usersService.sendCreateEmail(user.firstName, user.email);

      this.subscribersService.emit(
        process.env.RABBITMQ_QUEUE_NAME,
        new Message(`User ${user.firstName} was created!`),
      );

      return user;
    } catch (error) {
      console.error(error);
      throw new HttpException('Could not create user', 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      console.error(error);
      throw new HttpException('Could not find the user', 404);
    }
  }

  @Get(':id/avatar')
  async getUserAvatar(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOneOnDB(id);

      const avatar = await this.usersService.saveAvatar(user);

      const image = avatar.image.toString('base64');

      return image;
    } catch (error) {
      console.error(error);
      throw new HttpException('Could not get the avatar', 404);
    }
  }

  @Delete(':id/avatar')
  async removeAvatar(@Param('id') id: string) {
    try {
      const deletedAvatar = await this.usersService.removeAvatar(id);
      const image = deletedAvatar.image.toString('base64');
      return image;
    } catch (error) {
      console.error(error);
      throw new HttpException('Could not delete the avatar', 404);
    }
  }
}
