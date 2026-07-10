import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'ユーザー登録' })
  @ApiCreatedResponse({
    description: 'ユーザー登録に成功しました',
  })
  @ApiConflictResponse({
    description: 'メールアドレスがすでに使用されています',
  })
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return dto;
  }

  @ApiOperation({ summary: 'サインイン' })
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return dto;
  }
}
