class Service {
  
  constructor(name) {
    this.name = name;
  }

  run() {
    return Promise.resolve();
  }
}

export default Service;