import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role)
		private readonly _roleRepository: Repository<Role>,
	){}

	async get(id:number) :Promise<Role>{
		if(!id){
			throw new BadRequestException("id must be sent")
		}

		const role : Role = await this._roleRepository.findOne({
			where: {id: id, status : 'ACTIVE'},
		})

		if(!role){
			throw new NotFoundException()
		}

		return role
	}

	async getAll() :Promise<Role[]>{
		const roles : Role[] = await this._roleRepository.find({
			where: {status : 'ACTIVE'},
		})
		
		return roles
	}

	async create(role: Role): Promise<Role>{
		const savedRole:Role = await this._roleRepository.save(role)
		return savedRole
	}

	async update(id:number, role:Role): Promise<void> {
		await this._roleRepository.update(id, role)
	}

	async delete(id:number): Promise<void>{
		const roleExist = await this._roleRepository.findOne({
			where: {id:id, status:'ACTIVE'}
		})

		if(!roleExist){
			throw new NotFoundException()
		}

		await this._roleRepository.update(id, {status: 'INACTIVE'})
	}
}
