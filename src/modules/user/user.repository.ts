import { EntityRepository, Repository } from "typeorm";
import { User } from './user.entity';

// @Injectable()
// export class UserRepository{
// 	constructor(
// 		@InjectRepository(User)
// 		private readonly userRepository : Repository<User>,
// 	) {}
// }

@EntityRepository(User)
export class UserRepository extends Repository<User>{}