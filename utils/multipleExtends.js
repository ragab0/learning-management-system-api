class BaseClass {}
class MixinBuilder {
  constructor() {
    this.superclass = BaseClass;
  }
  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}

// this will combine everything in one class
const mix = () => new MixinBuilder();
