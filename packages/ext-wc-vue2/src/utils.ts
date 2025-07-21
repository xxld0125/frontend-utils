
/**
 * 解析 style 字符串为对象
 */
function parseStyleString(styleStr: string): Record<string, string> {
  const styles: Record<string, string> = {};
  if (!styleStr) return styles;

  styleStr.split(';').forEach(rule => {
    const colonIndex = rule.indexOf(':');
    if (colonIndex > 0) {
      const property = rule.slice(0, colonIndex).trim();
      const value = rule.slice(colonIndex + 1).trim();
      if (property && value) {
        // 转换 kebab-case 为 camelCase
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelProperty] = value;
      }
    }
  });

  return styles;
}

/**
 * HTML 元素转 Vue2 VNode
 */
export function htmlToVue2VNode(element: HTMLElement, h: any): any {
  if (!element || !h) return null;

  const tagName = element.tagName.toLowerCase();

  // 处理文本节点
  if (element.nodeType === Node.TEXT_NODE) {
    return element.textContent;
  }

  // 处理属性
  const attrs: Record<string, any> = {};
  const props: Record<string, any> = {};
  const domProps: Record<string, any> = {};
  const on: Record<string, any> = {};

  // 解析所有属性
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    const name = attr?.name ?? '';
    const value = attr?.value ?? '';

    if (name?.startsWith('on')) {
      // 事件处理 (onclick -> click)
      const eventName = name.slice(2).toLowerCase();
      try {
        on[eventName] = new Function('event', value);
      } catch {
        console.warn(`[ext-wc-vue2] 无法解析事件处理器: ${name}="${value}"`);
      }
    } else if (name === 'class') {
      attrs.class = value;
    } else if (name === 'style') {
      const styleObj = parseStyleString(value);
      if (Object.keys(styleObj).length > 0) {
        attrs.style = styleObj;
      }
    } else if (name.startsWith('data-') || name.startsWith('aria-')) {
      attrs[name] = value;
    } else if (['id', 'title', 'alt', 'src', 'href'].includes(name)) {
      attrs[name] = value;
    } else {
      // 普通属性
      props[name] = value;
    }
  }

  // 处理子节点
  const children: any[] = [];
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (child?.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        children.push(text);
      }
    } else if (child?.nodeType === Node.ELEMENT_NODE) {
      const childVNode = htmlToVue2VNode(child as HTMLElement, h);
      if (childVNode) {
        children.push(childVNode);
      }
    }
  }

  // 构建 VNode 数据对象
  const data: any = {};

  if (Object.keys(attrs).length > 0) {
    data.attrs = attrs;
  }
  if (Object.keys(props).length > 0) {
    data.props = props;
  }
  if (Object.keys(domProps).length > 0) {
    data.domProps = domProps;
  }
  if (Object.keys(on).length > 0) {
    data.on = on;
  }

  // 移除 display: none 样式
  if (data.attrs?.style?.display === 'none') {
    delete data.attrs.style.display;
    if (Object.keys(data.attrs.style).length === 0) {
      delete data.attrs.style;
    }
  }

  return h(tagName, data, children.length > 0 ? children : undefined);
}

/**
 * 获取插槽元素
 */
export function getSlot(container: HTMLElement, name: string): HTMLElement | null {
  const el = Array.from(container.children).find((item) =>
    item.getAttribute('slot') === name
  ) as HTMLElement;

  if (el) {
    hideElement(el);
  }

  return el || null;
}

/**
 * 隐藏元素
 */
export function hideElement(el: HTMLElement): void {
  if (el?.style) {
    el.style.display = 'none';
  }
}

/**
 * 清理样式中的 display: none
 */
export function cleanupStyle(vnode: any): void {
  if (vnode?.data?.attrs?.style) {
    delete vnode.data.attrs.style.display;
    if (Object.keys(vnode.data.attrs.style).length === 0) {
      delete vnode.data.attrs.style;
    }
  }
}

/**
 * 将单个 HTML 元素转换为 Vue2 VNode
 */
export function getVue2Node(el?: Element, h?: any): any {
  if (!el || !h) return undefined;

  const vnode = htmlToVue2VNode(el as HTMLElement, h);
  if (vnode) {
    cleanupStyle(vnode);
  }

  return vnode;
}

/**
 * 将多个 HTML 元素转换为 Vue2 VNode 数组
 */
export function getVue2Children(elementArr: HTMLElement[], h: any): any[] {
  if (!elementArr || elementArr.length === 0) return [];

  return elementArr.map(element => {
    hideElement(element); // 隐藏原始元素
    const vnode = htmlToVue2VNode(element, h);
    if (vnode) {
      cleanupStyle(vnode);
    }
    return vnode;
  }).filter(Boolean);
}

/**
 * 发送自定义事件
 */
export function fire(name: string, data: any, container: HTMLElement): void {
  try {
    container.dispatchEvent(
      new CustomEvent(name, {
        detail: data,
        bubbles: true,
        cancelable: true
      }),
    );
  } catch (error) {
    console.error(`[ext-wc-vue2] 发送事件失败: ${name}`, error);
  }
}

/**
 * 调试工具：打印 VNode 结构
 */
export function debugVNode(vnode: any, label: string = 'VNode'): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`[ext-wc-vue2] ${label}:`);
    console.log('Tag:', vnode?.tag);
    console.log('Data:', vnode?.data);
    console.log('Children:', vnode?.children);
    console.groupEnd();
  }
}
