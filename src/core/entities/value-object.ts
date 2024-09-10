export class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  equals(valueObject: ValueObject<Props>) {
    if (valueObject === undefined || valueObject === null) return
    if (valueObject.props === undefined) return

    return JSON.stringify(this.props) === JSON.stringify(valueObject.props)
  }
}
