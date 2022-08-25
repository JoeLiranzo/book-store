import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/config/config.keys';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([AuthRepository,User]),
		PassportModule.register({
			defaultStrategy: 'jwt'
		}),
		JwtModule.registerAsync({
			imports : [ConfigModule],
			inject : [ConfigService],
			useFactory(config: ConfigService){
				return {
					secret: config.get(Configuration.JWT_SECRET),
					signOptions: {
						expiresIn: 3600,
					}
				}
			}
		})
	],
	controllers: [AuthController],
	providers: [AuthService, ConfigService, JwtStrategy],
	exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
