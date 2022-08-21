import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appDataSource } from 'data-source';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDetails } from './user.details.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly _userRepository: Repository<User>,
	){}

	async get(id:number) :Promise<User>{
		if(!id){
			throw new BadRequestException("id must be sent")
		}

		const user : User = await this._userRepository.findOne({
			where: {id: id, status : 'ACTIVE'},
		})

		if(!user){
			throw new NotFoundException()
		}

		return user
	}

	async getAll() :Promise<User[]>{
		const users : User[] = await this._userRepository.find({
			where: {status : 'ACTIVE'},
		})
		
		return users
	}

	async create(user: User): Promise<User>{
		const details = new UserDetails();
		user.details = details

		//const repo = await getConnection().getRepository(Role)
		const repo = appDataSource.getRepository(Role);
		const defaultRole = await repo.findOne({where: {name:"GENERAL"}})
		user.roles = [defaultRole]
		
		const savedUser:User = await this._userRepository.save(user)

		return savedUser
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
