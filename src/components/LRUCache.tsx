class Node {
  key: string;
  value: string;
  prev: Node | null = null;
  next: Node | null = null;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

class LRUCache {
  private capacity: number;
  private cache: { [key: string]: Node };
  private head: Node;
  private tail: Node;
  private currentSize: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = {};
    this.currentSize = 0;

    // Dummy head and tail
    this.head = new Node("", "");
    this.tail = new Node("", "");
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private removeNode(node: Node): void {
    if (node.prev && node.next) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
  }

  private addToFront(node: Node): void {
    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) this.head.next.prev = node;
    this.head.next = node;
  }

  put(key: string, value: string): void {
    if (this.cache[key]) {
      const existingNode = this.cache[key];
      existingNode.value = value;
      this.removeNode(existingNode);
      this.addToFront(existingNode);
    } else {
      if (this.currentSize === this.capacity) {
        const lru = this.tail.prev!;
        this.removeNode(lru);
        delete this.cache[lru.key];
        this.currentSize--;
      }
      const newNode = new Node(key, value);
      this.cache[key] = newNode;
      this.addToFront(newNode);
      this.currentSize++;
    }
  }

  get(key: string): string | null {
    if (!this.cache[key]) {
      return null;
    }
    const node = this.cache[key];
    this.removeNode(node);
    this.addToFront(node);
    return node.value;
  }

  size(): number {
    return this.currentSize;
  }
}
 export default LRUCache 