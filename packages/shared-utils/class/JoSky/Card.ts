interface JoSkyCardToJSON {
  value: number | undefined
  isVisible: boolean
}

interface IJoSkyCard {
  readonly value: number
  readonly isVisible: boolean

  turnVisible(): void
  toJSON(): JoSkyCardToJSON
}

export class JoSkyCard implements IJoSkyCard {
  private _value: number
  private _isVisible: boolean = false

  constructor(value: number) {
    this._value = value
  }

  public get value() {
    return this._value
  }

  public get isVisible() {
    return this._isVisible
  }

  private set isVisible(value: boolean) {
    this._isVisible = value
  }

  public turnVisible() {
    this.isVisible = true
  }

  public toJSON() {
    return {
      value: this.isVisible ? this.value : undefined,
      isVisible: this.isVisible,
    }
  }
}
