import { Component, EventEmitter, Output, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { NgClass, NgIf } from '@angular/common';
import { TunnelSetCalamityRequestModel } from '../../../../services/tunnel/models/tunnel-set-calamity-request-model';
import { TunnelStatusResponseModel } from '../../../../services/tunnel/models/tunnel-status-response-model';
import { TunnelService } from '../../../../services/tunnel/tunnel.service';

@Component({
  selector: 'app-tunnel-interface',
  imports: [NgIconComponent, NgIf, NgClass],
  templateUrl: './tunnel-interface.component.html',
  styleUrl: './tunnel-interface.component.scss'
})
export class TunnelInterfaceComponent {

  @Output() cameraPositionChanged = new EventEmitter();
  @Output() calamitySet = new EventEmitter();
  tunnelStatus?: TunnelStatusResponseModel;

  constructor(private tunnelService: TunnelService) {}

  toggleCalamity(tunnelTubeNumber: number) {
    var requestModel: TunnelSetCalamityRequestModel = {
      isCalamity: !this.tunnelStatus?.tubes[tunnelTubeNumber].isCalamity
    }

    this.tunnelService.setCalamity(tunnelTubeNumber, requestModel).subscribe(() => {
      this.calamitySet.emit({tunnelTubeNumber, isCalamity: requestModel.isCalamity});
    });
  }
  
  setCameraPosition(cameraPositionX: number, cameraPositionY: number, cameraPositionZ: number, lookPositionX: number, lookPositionY: number, lookPositionZ: number) {
    this.cameraPositionChanged.emit({cameraPositionX, cameraPositionY, cameraPositionZ, lookPositionX, lookPositionY, lookPositionZ});
  }
}
