import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Configuration } from 'src/config/config.keys'
import { ConfigService } from 'src/config/config.service'
import { User } from 'src/modules/user/user.entity'
import { Repository } from 'typeorm'
import { AuthRepository } from '../auth.repository'
import { IJwtPayload } from '../jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
	constructor(
		private readonly _configService: ConfigService,
		@InjectRepository(AuthRepository)
		private readonly _authRepository : AuthRepository,
		@InjectRepository(User)
		private readonly _userRepository: Repository<User>
		){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: _configService.get(Configuration.JWT_SECRET),
		})
	}

	async validate(payload: IJwtPayload){
		const { username } = payload
		const user = await this._userRepository.findOne({
			where: {username, status: "ACTIVE"}
		})

		if (!user) {
			throw new UnauthorizedException()
		}

		return payload
	}
}