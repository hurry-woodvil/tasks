import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'ユーザー登録' })
  @ApiCreatedResponse({
    description: 'ユーザー登録に成功しました',
  })
  @ApiConflictResponse({
    description: 'メールアドレスがすでに使用されています',
  })
  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<AuthUserResponseDto> {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'サインイン' })
  @ApiOkResponse({
    description: 'サインインに成功しました',
    type: AuthUserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'メールアドレスまたはパスワードが正しくありません',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninDto): Promise<AuthUserResponseDto> {
    return this.authService.signin(dto);
  }
}
