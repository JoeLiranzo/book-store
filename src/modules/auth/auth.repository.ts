import { genSalt, hash } from 'bcryptjs';
import { appDataSource } from "data-source";
import { Role } from "../role/role.entity";
import { RoleType } from "../role/roletype.enum";
import { UserDetails } from "../user/user.details.entity";
import { User } from "../user/user.entity";
import { SignUpDto } from "./dto";

export class AuthRepository {
	static async signup(singupDto : SignUpDto){
		const {username, email, password} = singupDto
		const user = new User()
		user.username = username
		user.email = email

		const roleRepository = await appDataSource.getRepository(Role);
		const defaultRole: Role = await roleRepository.findOne({where: {name: RoleType.GENERAL}})

		user.roles = [defaultRole]

		const details = new UserDetails()
		user.details = details

		const salt = await genSalt(10)
		user.password = await hash(password, salt)

		await user.save()
	}
}