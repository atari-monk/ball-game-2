export class Vector2 {
  constructor(public x: number, public y: number) {}

  // Addition of vectors
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  // Subtraction of vectors
  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  // Scalar multiplication
  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  // Dot product
  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y
  }

  // Magnitude (length) of the vector
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  // Normalize the vector (make it a unit vector)
  normalize(): Vector2 {
    const mag = this.magnitude()
    if (mag === 0) return new Vector2(0, 0)
    return new Vector2(this.x / mag, this.y / mag)
  }
}
