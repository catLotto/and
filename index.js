/*
 * Normal Mode
const a = new And('div')
.$appendParent(document.body)
.id('contents')
.className('app');

const b = a.$childCreateTo('span')
.innerText('1st SPAN')
.$style('background: red;');

const c = b.$nextCreateTo('span')
.innerText('2nd SPAN')
.$style('background: blue;');

const d = c.$prevCreateTo('span')
.innerText('3rd SPAN')
.$style('background: purple;');

a !== b !== c !== d

 * Build Mode
const a = new And('build', 'div')
.$appendParent(document.body)
.id('contents')
.className('app');

const b = a.$childCreateTo('span')
.innerText('1st SPAN')
.$style('background: red;');

const c = b.$nextCreateTo('span')
.innerText('2nd SPAN')
.$style('background: blue;');

const d = c.$prevCreateTo('span')
.innerText('3rd SPAN')
.$style('background: purple;');

a === b === c === d 
*/
class And {
  constructor(...param) {
    let el;
    if (param[0] === 'build_mode') {
      this.el = param[1];
      this._build = true;
      if (param[1] instanceof HTMLElement) this.el = param[1];
      else this.el = this.$$createTo(...param.slice(1));
    } else {
      if (param[0] instanceof HTMLElement) this.el = param[0];
      else this.el = this.$$createTo(...param);
    }
    const setMethods = ['id', 'className', 'setAttribute', 'innerText', 'innerHTML', 'appendChild'];
    const $Methods = ['appendTo', 'remove'];

    for (const method of setMethods) {
      Object.defineProperty(this, method, {
        value: (...param) => this.then(this, method, ...param)
      });
    }
  }

  $prevCreateTo(...param) {
    const el = this.$$createTo(...param);
    this.el.parentElement.insertBefore(el, this.el);
    if (this._build) {
      this.el = el;
      return this;
    } else {
      return new Thec(el);
    }
  }
  
  $nextCreateTo(...param) {
    const el = this.$$createTo(...param);
    this.$insertAfter(el);
    if (this._build) {
      this.el = el;
      return this;
    } else {
      return new Thec(el);
    }
  }
  
  $parentCreateTo(...param) {
    const el = this.$$createTo(...param);
    el.appendChild(this.el);
    if (this._build) {
      this.el = el;
      return this;
    } else {
      return new Thec(el);
    }
  }
  
  $childCreateTo(...param) {
    const el = this.$$createTo(...param);
    this.el.appendChild(el);
    if (this._build) {
      this.el = el;
      return this;
    } else {
      return new Thec(el);
    }
  }
  
  $$createTo(tagName, attrsObj, parent) {
    const el = document.createElement(tagName);
    this.$attrs(attrsObj, el);
    if (parent) parent.appendChild(el);
    return el;
  }

  $attrs(v, param) {
    const el = param ? param : this.el;
    if (typeof v === 'object') {
      for (const key in v) {
        el.setAttribute(key, v[key]);
      }
    }
    else if (typeof v === 'string') {
      return el.getAttribute(v);
    }
  }

  $appendParent(param) {
    param.appendChild(this.el);
    return this;
  }

  $insertAfter(param) {
    if (this.el.nextSiblingElement) this.el.parentElement.insertBefore(param, this.el.nextSiblingElement);
    else this.el.parentElement.appendChild(param);
    return this;
  }

  // $remove() {
  //   this.el.parentElement.removeChild(this.el);
  //   for(const key in this) {
  //     delete this[key];
  //   }
  //   return true;
  // }
  
  $style(param) {
    if (typeof param === 'object') {
      for (const key in param) {
        this.el.style[key] = param[key];
      }
    } else if (typeof param === 'string') {
      const attributes = param.trim().split(';').filter(item => item);
      for (const attribute of attributes) {
        const [ key, value ] = attribute.split(':');
        this.el.style[key.trim()] = value.trim();
      }
    }
    return this;
  }
  
  then(self, method, ...param) {
    const { el } = self;

    if (typeof el[method] === 'function') el[method](...param);
    else el[method] = param[0];
    return self;
  }
}