export function xmlToJson(node: Element): any {
  const obj: any = {};
  if (node.attributes) {
    Array.from(node.attributes).forEach(attr => {
      obj[`@${attr.name}`] = attr.value;
    });
  }
  const children = Array.from(node.childNodes).filter(n => n.nodeType === 1);
  const textNodes = Array.from(node.childNodes).filter(n => n.nodeType === 3);
  if (textNodes.length) {
    const text = textNodes.map(n => n.nodeValue?.trim()).join('');
    if (text) obj['#text'] = text;
  }
  children.forEach(child => {
    const el = child as Element;
    const name = el.nodeName;
    const val = xmlToJson(el);
    if (obj[name]) {
      if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
      obj[name].push(val);
    } else {
      obj[name] = val;
    }
  });
  return obj;
}
