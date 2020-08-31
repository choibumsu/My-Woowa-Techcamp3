type IEvent = {
  type: string
  handler: Function
}
export class Observable {
  observers: Set<IEvent> = new Set()
  on(type: string, handler: Function) {
    this.observers.add({
      type,
      handler,
    })
  }
  off(type: string) {
    Array.from(this.observers)
      .filter((x) => x.type === type)
      .forEach((item: IEvent) => {
        this.observers.delete(item)
      })
  }
  emit(type: string, payload = undefined) {
    Array.from(this.observers)
      .filter((x) => x.type === type)
      .forEach((observer) => {
        observer.handler(payload)
      })
  }
}
