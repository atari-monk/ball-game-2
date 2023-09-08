import { IField } from '../api/IField'
import { FieldDto } from './FieldDto'

export class MapDto {
  field: FieldDto

  constructor(field: IField) {
    this.field = new FieldDto(field)
  }
}
