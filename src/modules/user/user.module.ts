import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../role/role.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, Role]), SharedModule, AuthModule],
	providers: [UserService],
	controllers: [UserController]
})

export class UserModule {}
