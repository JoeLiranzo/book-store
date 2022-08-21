import { TypeOrmModule } from '@nestjs/typeorm'
import { Configuration } from 'src/config/config.keys'
import { ConfigModule } from 'src/config/config.module'
import { ConfigService } from 'src/config/config.service'
import { DataSourceOptions } from 'typeorm'

export const databaseProviders = [
	TypeOrmModule.forRootAsync({
		imports : [ConfigModule],
		inject: [ConfigService],

		async useFactory(config: ConfigService) {
			return {
				ssl: false,
				type: 'postgres' as 'postgres',
				host: config.get(Configuration.HOST),
				username: config.get(Configuration.USERNAME),
				password: config.get(Configuration.PASSWORD),
				database: config.get(Configuration.DATABASE),
				entities: [__dirname + '/../**/*.entity{.js,.ts}'],
				migrations: [__dirname + '/migrations/*{.js,.ts}']
			} as DataSourceOptions
		}
	})
]