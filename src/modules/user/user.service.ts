import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appDataSource } from 'data-source';
import { MapperService } from 'src/shared/mapper.service';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDto } from './dto/user.dto';
import { UserDetails } from './user.details.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly _userRepository: Repository<User>,
		private readonly _mapperService: MapperService,

	){}

	async get(id:number) :Promise<UserDto>{
		if(!id){
			throw new BadRequestException("id must be sent")
		}

		const user : User = await this._userRepository.findOne({
			where: {id: id, status : 'ACTIVE'},
		})

		if(!user){
			throw new NotFoundException()
		}

		return this._mapperService.map<User, UserDto>(user, new UserDto)
	}

	async getAll() :Promise<UserDto[]>{
		const users : User[] = await this._userRepository.find({
			where: {status : 'ACTIVE'},
		})
		
		const data : UserDto[] = this._mapperService.mapCollection<User, UserDto>(users, new UserDto)
		return data
	}

	async create(user: User): Promise<UserDto>{
		const details = new UserDetails();
		user.details = details

		//const repo = await getConnection().getRepository(Role)
		const repo = appDataSource.getRepository(Role);
		const defaultRole = await repo.findOne({where: {name:"GENERAL"}})
		user.roles = [defaultRole]
		
		const savedUser:User = await this._userRepository.save(user)

		return this._mapperService.map<User, UserDto>(savedUser, new UserDto())
	}

	async update(id:number, user:User): Promise<void> {
		await this._userRepository.update(id, user)
	}

	async delete(id:number): Promise<void>{
		const userExist = await this._userRepository.findOne({
			where: {id:id, status:'ACTIVE'}
		})

		if(!userExist){
			throw new NotFoundException()
		}

		await this._userRepository.update(id, {status: 'INACTIVE'})
	}
}
