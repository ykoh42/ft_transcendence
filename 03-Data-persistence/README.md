# Data persistence with PostgreSQL and typeorm

## Database container

```sh
docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

## Database connection

```sh
yarn add typeorm @nestjs/typeorm pg
```

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

## users 모듈 만들기

```ts
nest g mo users
```

## Users entity 만들기

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
```

## Users repository 만들기

```ts
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {}
```

```ts
import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
})
export class UsersModule {}
```

## CRUD 만들기

```sh
nest g co users
nest g s users
```

### POST /users

```ts
export class CreateUserDto {
  name: string;
}
```

```ts
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
```

```ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }
}
```

```ts
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;

    const user = this.create({
      name,
    });

    await this.save(user);
    return user;
  }
}
```

### GET /users

```ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }
}
```

```ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }
}
```

```ts
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;

    const user = this.create({
      name,
    });

    await this.save(user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await this.find();
  }
}
```

### PATCH /users/:id

```ts
export class UpdateUserDto {
  name: string;
}
```

```ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(updateUserDto);
  }
}
```

```ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }
}
```

```ts
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;

    const user = this.create({
      name,
    });

    await this.save(user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await this.find();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { name } = updateUserDto;
    user.name = name;
    await this.save(user);
    return user;
  }
}
```

### DELETE /users/:id

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
```

```ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  deleteUser(id: string): Promise<void> {
    return this.usersRepository.deleteUser(id);
  }
}
```

```ts
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;

    const user = this.create({
      name,
    });

    await this.save(user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await this.find();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { name } = updateUserDto;
    user.name = name;
    await this.save(user);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
```
