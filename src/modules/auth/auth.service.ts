import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { SignInDto, SignUpDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AuthRepository)
		private readonly _authRepository : AuthRepository,
		@InjectRepository(User)
		private readonly _userRepository: Repository<User>,
		private readonly _jwtService : JwtService,
	) {}

	async signup(singupDto: SignUpDto) : Promise<void>{
		const {username, email} = singupDto
		const userExist = await this._userRepository.findOne({
			where: [{username}, {email}]
		});

		if(userExist){
			throw new ConflictException('username or email alraedy exists');	
		}

		return this._authRepository.signup(singupDto)
	}

	async signin(signinDto : SignInDto) : Promise<{token:string}>{
		const {username, password} = signinDto
		const user : User = await this._userRepository.findOne({
			where : { username }
		})

		if(!user){
			throw new NotFoundException('user does not exist')
		}

		const isMatch = await compare(password, user.password)

		if(!isMatch){
			throw new UnauthorizedException('invalid credentials')
		}

		const payload : IJwtPayload = {
			id: user.id,
			email: user.email,
			username: user.username,
			roles: user.roles.map(r=>r.name as RoleType)			
		}

		const token = await this._jwtService.sign(payload)
		return {token}
	}
}
