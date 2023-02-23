import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign, verify } from "jsonwebtoken";

@Injectable()
export class TokenService {
    private jwt_secret: string;
    private jwt_expire: string;
    constructor(private configService: ConfigService) {
        this.jwt_secret = this.configService.get('JWT_SECRET')
        this.jwt_expire = this.configService.get('JWT_EXPIRE')
    }

    async validateToken(token: string) {
        return await verify(token, this.jwt_secret)
    }

    async generateToken(user_id: string, role: string, permissions: string[]) {
        return await sign(
            {
                user_id,
                role,
                permissions,
            },
            this.jwt_secret,
            {
                expiresIn: this.jwt_expire
            }
        )
    }
}
ConfigService
