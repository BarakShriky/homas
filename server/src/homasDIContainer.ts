import {AwilixContainer} from 'awilix/lib/container';
import MongoAccess from './mongo/mongoAccess';
import {asValue, createContainer, asClass, InjectionMode} from 'awilix';
import UserService from './services/userService';
import {EmailService} from './technicalServices/emailService';
import config from './homasConfig';
import {UserRepository} from './mongo/repositories/userRepository';
import {UserMapper} from './mappers/userMapper';
import {Logger} from './helpers/logger';

//===============Dependencies Container================
export function configureContainer(): AwilixContainer {
    return createContainer({
        injectionMode: InjectionMode.CLASSIC,
    }).register({
        // services
        userService: asClass(UserService).singleton(),
        logger: asValue(Logger),
        emailService: asValue(
            new EmailService(Logger, {
                host: config.email.smtpHost,
                port: config.email.port,
                userName: config.email.username,
                password: config.email.password,
            }),
        ),
        // repositories
        userRepository: asValue(new UserRepository()),
        // mongo
        mongoAccess: asClass(MongoAccess).singleton(),
        // mappers
        userMapper: asClass(UserMapper).singleton(),
    });
}
