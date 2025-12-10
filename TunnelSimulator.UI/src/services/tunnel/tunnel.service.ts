import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TunnelStatusResponseModel } from './models/tunnel-status-response-model';
import { TunnelSetCalamityRequestModel } from './models/tunnel-set-calamity-request-model';

@Injectable({
  providedIn: 'root'
})
export class TunnelService {
  private apiUrl = '/api/tunnel';

  constructor(private http: HttpClient) { }

  getTunnelStatus(): Observable<TunnelStatusResponseModel> {
    return this.http.get<TunnelStatusResponseModel>(`${this.apiUrl}`);
  }

  setCalamity(tunnelTube: number, requestModel: TunnelSetCalamityRequestModel) {
    return this.http.post(`${this.apiUrl}/${tunnelTube}/Calamity`, requestModel);
  }
}
