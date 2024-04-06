export enum LoginE {
    email = 'email',
    pass = 'password',
    confirmPass = 'confirmPass'
}

export interface SignUp {
    readonly [LoginE.email]: string,
    readonly [LoginE.pass]: string,
    readonly [LoginE.confirmPass]: string
}

export type Login = Pick<SignUp, LoginE.email | LoginE.pass>