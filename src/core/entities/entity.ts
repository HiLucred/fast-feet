import { UniqueEntityId } from './unique-entity-id'

export class Entity<Props> {
  private readonly _id: UniqueEntityId
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  get id() {
    return this._id
  }

  equals(entity: Entity<Props>) {
    return this === entity
  }
}
