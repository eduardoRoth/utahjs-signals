import { computed, effect, Injectable, OnInit, signal } from '@angular/core';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _users = signal<User[]>([]);
  users = this._users.asReadonly();
  favoriteUsers = computed(
    () => this.users().filter((user) => user.isFavorite).length,
  );
  totalUsers = computed(() => this.users().length);

  constructor() {
    try {
      const userList = JSON.parse(window.localStorage.getItem('users') ?? '');
      this._users.set(userList);
    } catch (err) {
      console.log('User list not present in LocalStorage');
    }
    effect(() => {
      const userList = JSON.stringify(this._users());
      window.localStorage.setItem('users', userList);
    });
  }

  addUser(user: User) {
    this._users.mutate((users) => users.push(user));
  }

  updateUser(user: User) {
    this._users.mutate((users) =>
      users.splice(
        this._users().findIndex((u) => u.email === user.email),
        1,
        user,
      ),
    );
  }

  removeUser(user: User) {
    this._users.update((users) => users.filter((u) => u.email !== user.email));

    /*
      this._users.mutate((users) =>
        users.splice(
          this._users().findIndex((u) => u.email === user.email),
          1,
        ),
      );
    */
  }
}
