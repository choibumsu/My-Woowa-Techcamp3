class Emitter {
  on(type, callback) {
    this['_on' + type] = this['_on' + type] || []
    this['_on' + type].push(callback)
  }

  off(type, removedCallback) {
    this['_on' + type] = this['_on' + type].filter(
      (callback) => callback !== removedCallback
    )
  }

  emit(type, args) {
    this['_on' + type] &&
      this['_on' + type].forEach((callback) => {
        callback(args)
      })
  }
}

export default new Emitter()
