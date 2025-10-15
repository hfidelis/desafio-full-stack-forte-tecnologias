export interface AssetParentDto {
  id: number;
  name: string;
}

export interface CreateAssetDto {
  name: string;
  typeId: number;
  statusId: number;
}

export interface UpdateAssetDto {
  name?: string;
  typeId?: number;
  statusId?: number;
}

export interface Asset extends CreateAssetDto {
  id: number;
  type: AssetParentDto;
  status: AssetParentDto;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAssets {
  results: Asset[];
  count: number;
  page: number;
  page_size: number;
}
