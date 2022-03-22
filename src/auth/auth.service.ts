import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {

    signup() {
        return {msg: 'Hello world'}
    }

    signin() {
        return {msg: 'Hello world'}
    }
}