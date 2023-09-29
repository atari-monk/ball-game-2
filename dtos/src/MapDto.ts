import { IField, IGates } from 'game-api'
import { FieldDto } from './FieldDto'
import { GateDto } from './GateDto'
import { IGateDtos } from './IGateDtos'

export class MapDto {
  gates: IGateDtos
  field: FieldDto

  constructor(gates: IGates, field: IField) {
    this.gates = {
      left: new GateDto(gates.left),
      right: new GateDto(gates.right),
    }
    this.field = new FieldDto(field)
  }
}
