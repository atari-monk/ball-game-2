import { IField } from '../api/IField'

export class FieldDto {
  width: number
  height: number

  constructor(field: IField) {
    this.width = field.width
    this.height = field.height
  }
}
