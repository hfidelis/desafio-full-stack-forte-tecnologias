import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedUsers } from '../../interfaces/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, page_size: number = 10): Observable<PaginatedUsers> {
    return this.http.get<PaginatedUsers>(`${this.baseUrl}?page=${page}&page_size=${page_size}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
