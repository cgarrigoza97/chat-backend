import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { SignupDto, SigninDto, AuthResponseDto, RefreshTokenDto } from './dto';
import { UserDocument } from '../user/user.schema';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async signup(dto: SignupDto) {

        const user = await this.userModel.findOne({ email: dto.email });

        if (user)
            throw new ConflictException('Email already exists');

        const passwordHash = await hash(dto.password);
        dto.password = passwordHash;
        
        const newUser = await this.userModel.create(dto);

        const response = await this.signToken(newUser.id, newUser.username, newUser.email);
        
        return response;
    }

    async signin(dto: SigninDto) {
        
        const user = await this.userModel.findOne({ email: dto.email });

        if (!user)
            throw new UnauthorizedException('Bad credentials');

        const isPasswordCorrect = await verify(user.password, dto.password);

        if (!isPasswordCorrect)
            throw new UnauthorizedException('Bad credentials');

        const response = await this.signToken(user.id, user.username, user.email);
        
        return response;

    }

    async refreshToken(dto: RefreshTokenDto) {

        try {
            const { sub, username, email } = await this.jwt.verifyAsync(dto.refreshToken, {
                secret: this.config.get<string>('JWT_SECRET')
            });

            const payload = {
                sub, 
                username,
                email
            }

            const accessToken = await this.jwt.signAsync(payload, {
                expiresIn: '5m',
                secret: this.config.get<string>('JWT_SECRET')
            }) 

            const refreshToken = await this.jwt.signAsync(payload, {
                expiresIn: 60 * 24 * 30 + 'm',
                secret: this.config.get<string>('JWT_SECRET')
            }); 

            return {
                accessToken,
                refreshToken
            }
        } catch(e) {
            throw new UnauthorizedException("Invalid token");
        }

        return ;

    }

    private async signToken(userId: string, username: string, email: string): Promise<AuthResponseDto> {
        const payload = {
            sub: userId,
            username, 
            email
        }

        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '5m',
            secret: this.config.get<string>('JWT_SECRET')
        });
        
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: 60 * 24 * 30 + 'm',
            secret: this.config.get<string>('JWT_SECRET')
        }); 

        return {
            accessToken,
            refreshToken
        };
    }
}