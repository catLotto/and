# And.js
Super Extremely light DOM control library. And.js wraps a DOM Element with an And object, making it possible to use native methods continuously.

Example:

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
