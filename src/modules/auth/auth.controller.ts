import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService : AuthService){}

	@Post('/signup')
	@UsePipes(ValidationPipe)
	async signup(@Body() signUpDto: SignUpDto) : Promise<void>{
		return this._authService.signup(signUpDto)
	}

	@Post('/signin')
	@UsePipes(ValidationPipe)
	async signin(@Body() signInDto: SignInDto){
		return this._authService.signin(signInDto)
	}	
}
