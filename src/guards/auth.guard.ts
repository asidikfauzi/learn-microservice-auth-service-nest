import { 
    ExecutionContext, 
    Injectable, 
    UnauthorizedException 
} from "@nestjs/common";
import { TokenService } from "src/services";

@Injectable()
export class JwtAuthGuard {
    constructor(private tokenService: TokenService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        let token = request.headers['authorization'];
        if(!token) {
            throw new UnauthorizedException();
        }
        token = token.replace('Bearer ', '');
        const user = await this.tokenService.validateToken(token);
        if(!user) {
            throw new UnauthorizedException();
        }
        request.user = user;
        return true;
    }
}