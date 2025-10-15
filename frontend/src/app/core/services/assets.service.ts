import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateAssetDto,
  AssetParentDto,
  PaginatedAssets,
  UpdateAssetDto,
  Asset,
} from '../../interfaces/assets.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private baseUrl = 'http://localhost:3000/api/assets';

  constructor(private http: HttpClient) {}

  getAssets(page: number = 1, page_size: number = 10): Observable<PaginatedAssets> {
    return this.http.get<PaginatedAssets>(`${this.baseUrl}?page=${page}&page_size=${page_size}`);
  }

  getAssetById(id: number): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/${id}`);
  }

  createAsset(dto: CreateAssetDto): Observable<Asset> {
    return this.http.post<Asset>(this.baseUrl, dto);
  }

  updateAsset(id: number, dto: UpdateAssetDto): Observable<Asset> {
    return this.http.patch<Asset>(`${this.baseUrl}/${id}`, dto);
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  assignAssetToEmployee(assetId: number, employeeId: number): Observable<Asset> {
    return this.http.patch<Asset>(`${this.baseUrl}/${assetId}/assign/${employeeId}`, {});
  }

  unassignAsset(assetId: number): Observable<Asset> {
    return this.http.patch<Asset>(`${this.baseUrl}/${assetId}/unassign`, {});
  }

  getAssetsByEmployee(employeeId: number): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  getAssetTypes(): Observable<AssetParentDto[]> {
    return this.http.get<AssetParentDto[]>(`${this.baseUrl}/types`);
  }

  getAssetStatuses(): Observable<AssetParentDto[]> {
    return this.http.get<AssetParentDto[]>(`${this.baseUrl}/statuses`);
  }
}
