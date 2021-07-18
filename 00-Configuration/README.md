# Configuration

> https://docs.nestjs.kr/techniques/configuration#configuration

## 목표

1. Stage(dev, prod)에 따른 환경 구성
2. Configuration schema 검증

## Stage에 따른 환경 구성

### pakage.json 수정

`pakage.json` 에서 원하는 `STAGE`를 구성합니다.

```json
"start:dev": "STAGE=dev nest start --watch",
"start:debug": "STAGE=dev nest start --debug --watch",
"start:prod": "STAGE=prod node dist/main",
"test": "STAGE=dev jest",
```

### .env 파일 만들기

`@nestjs/config`는 내부적으로 `.env`를 사용합니다.

```sh
echo 'TEST_VALUE=hello from dev' > .env.stage.dev
echo 'TEST_VALUE=hello from prod' > .env.stage.prod
```

### 패키지 설치

`ConfigModule`을 사용하기 위해 패키지를 설치합니다.

```sh
yarn add @nestjs/config
```

### app.module.ts

1. `ConfigModule`을 import하고,
2. `STAGE`에 따라 다른 `.env` 파일을 `envFilePath`에 설정합니다.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### app.controller.ts

1. `controller`에 `ConfigService`를 injection 해주고,
2. `console.log`를 통해 `.env`에 설정한 `TEST_VALUE`를 출력합니다.

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log(this.configService.get('TEST_VALUE'));
    return this.appService.getHello();
  }
}
```

### 동작 확인

1. 아래 두가지 커맨드로 각각 서버를 실행해보고,
2. [`http://localhost:3000`](http://localhost:3000)로 접속하여,
3. `console.log`를 확인합니다.

```sh
yarn start:dev
```

```sh
yarn start:prod
```

## Config schema validation

`@hapi/joi`패키지를 통해 config schema를 검증할 수 있습니다.

### 패키지 설치

```sh
yarn add @hapi/joi
yarn add -D @types/hapi__joi
```

### config.schema.ts

`config.schema.ts`파일을 만들고, 검증할 환경변수에 대한 설정을 작성합니다.

```ts
import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
```

### app.module.ts

`validationSchema` 프로퍼티에 위에서 작성한 `configValidationSchema`를 설정해줍니다.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 동작 확인

이제 `configValidationSchema`의 설정대로 환경변수가 검증됩니다.

```sh
yarn start:dev
```

```
Error: Config validation error: "DB_HOST" is required. "DB_PORT" is required. "DB_PASSWORD" is required. "DB_DATABASE" is required
```

`.env`에 `DB_HOST`, `DB_PORT`, `DB_PASSWORD`, `DB_DATABASE` 환경변수를 추가하고, 다시 서버를 실행시키면 에러가 사라집니다.
