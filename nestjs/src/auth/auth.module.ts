import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy'; // นำเข้า LocalStrategy
import { LocalAuthGuard } from './local-auth.guard'; 
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; 

@Module({
  imports: [
    UsersModule,
    PassportModule, 
    JwtModule.register({
      secret: 'secretKey', 
      signOptions: { expiresIn: '60m' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy], 
})
export class AuthModule {}
