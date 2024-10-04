// 1. we need a function that can create
// a required html element (div, p, section, ul, ol, list, span)
// 2. we should be able to set props needed. For example, id, class
// it could be some event handlers, etc.
// 3. Set the children. Children can be plain string, or another element, or an array of elements.

/*
<div id="main-section">
<h1> Title </h1>
<p> Content go here </p>
</div>
element that needs to be created 'div'
props: {id: 'main-section', class= 'main-section-c' , onclick: ''}
array of children - h1, p

*/

// One enhancement, we can do is, instead of directly
// creating DOM elements, we shall build a data structure
// And this data structure can be rendered on demand.
export interface ReactElement {
  type: string; // 'div', 'li'... any html element type
  props: Record<string, any> | null;
  children: (ReactElement | string)[];
}

export function createElement(
  elementType: string,
  props: Record<string, any> | null,
  ...children: (ReactElement | string)[]
): ReactElement {
  // we can potentially do some transformations on props if needed.
  const reactElement = {
    type: elementType,
    props: props,
    children,
  };
  return reactElement;
}

function renderInner(reactElement: ReactElement): HTMLElement {
  const { type, props, children } = reactElement;
  const element = document.createElement(type);
  // set the props
  if (props !== null) {
    Object.entries(props).forEach(([prop, value]) => {
      element.setAttribute(prop, value);
    });
  }

  // Append the children to this element
  children.forEach((child) => {
    let childNode: Node;
    if (typeof child === "string") {
      childNode = document.createTextNode(child);
    } else {
      childNode = renderInner(child);
    }
    element.appendChild(childNode);
  });
  return element;
}

export function render(reactElement: ReactElement, host: HTMLElement): void {
  // 1. first create the DOM structure needed for reactElement
  // 2. and it as child of host.
  const element = renderInner(reactElement);
  host.replaceChildren(element);
}

const aDiv = createElement(
  "div",
  { id: "container" },
  createElement("h1", null, "React Introduction"),
  createElement(
    "p",
    null,
    createElement("strong", null, "React"),
    "is a cool framework"
  )
);
console.dir(aDiv, { depth: null });
// let element = document.createElement(elementType);
//   // set the props;
//   if (props !== null) {
//     Object.entries(props).forEach(([prop, value]) => {
//       element.setAttribute(prop, value);
//     });
//   }

//   // Append the children passed as children of element
//   children.forEach((child) => {
//     let childNode: Node;
//     if (typeof child === "string") {
//       childNode = document.createTextNode(child);
//     } else {
//       childNode = child;
//     }
//     element.appendChild(childNode);
//   });
// return element;

// const h1 = createElement("h1", null, "Title");
// const p = createElement("p", null, "contents go here");
// const div = createElement("div", { id: "main-section" }, h1, p);
