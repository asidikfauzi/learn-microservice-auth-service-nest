import { BadRequestException, ForbiddenException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { LoginDTO, RegisterDTO } from './dtos';
import { PrismaService, TokenService } from './services';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private token: TokenService,
    @Inject('LOG_SERVICE')
    private readonly logClient: ClientProxy,
  ) {}

  async login(req, body: LoginDTO, ip) {
    const {username_or_email, password} = body;

    const user = await this.prisma.user.findFirst({
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
      where: {
        OR: [
          {email:username_or_email},
          {username:username_or_email},
        ]
      }
    });

    if(!user) {
      return new NotFoundException(
        "We couldn't find your account. Please check your information or sign up for a new account."
      )
    }

    if(!user.is_active) {
      return new ForbiddenException(
        'Your account is inactive. Please log in and activate it before continuing.',
      )
    }

    if(!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        'incorrect login information. Please check your username and password and try again.'
      )
    }

    const permissionCodes = user.role.permissions.map(
      ({ permission }) => permission.permission_code,
    );

    const accesToken = await this.token.generateToken(
      user.id,
      user.role.role_name,
      permissionCodes
    );

    user['role_name'] = user.role.role_name;
    delete user.role_id;
    delete user.role;
    delete user.password
    delete user.deleted_at

    const getIp = ip.replace(/:|f/g, "");
    const userAgent = req.headers['user-agent'];
    
    const logPayload = {
      timestamp: new Date(),
      action: 'LOGIN',
      user_id: user.id,
      ip_address: getIp,
      user_agent: userAgent,
      details: '',
    }

    this.logClient.emit('add_log', JSON.stringify(logPayload));

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Login',
      data: {
        accesToken,
        user
      }
    }

  }

  async register(req, body: RegisterDTO, ip) {
    const {username, email, password, role_id} = body

    const role = await this.prisma.role.findUnique({
      where: {id: role_id},
      include: {
        permissions: {
          include: {
            permission:true,
          }
        }
      }
    })
     
    if(!role) {
      return new BadRequestException('Invalid role id')
    }
    
    //check username exist
    const usernameExist = await this.prisma.user.findUnique({
      where: {username: username}
    })

    if(usernameExist) {
      return new BadRequestException('Username already exist.')
    }

    //check email exist
    const emailExist = await this.prisma.user.findUnique({
      where: {email:email}
    })

    if(emailExist) {
      return new BadRequestException('Email already exist.')
    }

    const newUser = {} as User;
    newUser.username = username;
    newUser.email = email;
    newUser.role_id = role_id;
    newUser.is_active = true;
    newUser.password = await bcrypt.hash(password,10)

    const user = await this.prisma.user.create({data: newUser})

    const permissionCodes = role.permissions.map(
      ({ permission }) => permission.permission_code
    );

    const accesToken = await this.token.generateToken(
      user.id,
      role.role_name,
      permissionCodes,
    );

    user['role_name'] = role.role_name;
    delete user.role_id;
    delete user.password;
    delete user.deleted_at;

    const getIp = ip.replace(/:|f/g, "");
    const userAgent = req.headers['user-agent'];

    const logPayload = {
      timestamp: new Date(),
      action: 'REGISTER',
      user_id: user.id,
      ip_address: getIp,
      user_agent: userAgent,
      details: '',
    };

    this.logClient.emit('add_log', JSON.stringify(logPayload));

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Register',
      data : {
        accesToken,
        user,
      },
    };
  }

  async getAuthUser(req) {
    const user = await this.prisma.user.findFirst({
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
      where: { id: req.user.user_id },
    });

    user['role_name'] = user.role.role_name;
    delete user.role_id;
    delete user.role;
    delete user.password
    delete user.deleted_at
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Get Authenticated User',
      data: user,
    }
  }
}
