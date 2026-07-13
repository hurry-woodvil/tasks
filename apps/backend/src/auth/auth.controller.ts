import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './models/jwt-payload';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'ユーザー登録' })
  @ApiCreatedResponse({
    description: 'ユーザー登録に成功しました',
    type: AuthUserResponseDto,
  })
  @ApiConflictResponse({
    description: 'メールアドレスがすでに使用されています',
    type: ErrorResponseDto,
  })
  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<AuthUserResponseDto> {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'サインイン' })
  @ApiOkResponse({
    description: 'サインインに成功しました',
    type: SigninResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'メールアドレスまたはパスワードが正しくありません',
    type: ErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.signin(dto);
  }

  @ApiOperation({ summary: 'ログインユーザー取得' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'ログインユーザー',
  })
  @ApiUnauthorizedResponse({
    description: '認証が必要です',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() currentUser: JwtPayload) {
    return this.authService.getCurrentUser(currentUser.sub);
  }
}
