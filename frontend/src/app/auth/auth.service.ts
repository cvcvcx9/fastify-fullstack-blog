import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LoginDocument, LoginGQL, RegisterDocument, RegisterGQL } from '../../generated/graphql';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private registerGQL:RegisterGQL,private loginGQL:LoginGQL) { }
  register(username: string, password: string,email?: string) {
    return this.registerGQL.mutate({
        username,
        email,
        password
    }).pipe(
      map(result=> result.data?.register)
    );
  }
  login(username: string, password: string) {
    return this.loginGQL.mutate({
        username,
        password
      }).pipe(
      map(result => result.data?.login)
    );
  }
}
