import React, { useState, useMemo } from 'react';

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

  // Method to get the cache as an array for display
  getCacheAsArray(): { key: string, value: string }[] {
    const result: { key: string, value: string }[] = [];
    let currentNode = this.head.next;
    while (currentNode && currentNode !== this.tail) {
      result.push({ key: currentNode.key, value: currentNode.value });
      currentNode = currentNode.next;
    }
    return result;
  }
}

const LRUCacheComponent: React.FC = () => {
  const [capacity] = useState(5);
  const cache = useMemo(() => new LRUCache(capacity), [capacity]);
  const [cacheState, setCacheState] = useState(cache.getCacheAsArray());
  const [putKey, setPutKey] = useState('');
  const [putValue, setPutValue] = useState('');
  const [getKey, setGetKey] = useState('');
  const [getValue, setGetValue] = useState<string | null>(null);

  const handlePut = () => {
    if (putKey && putValue) {
      cache.put(putKey, putValue);
      setCacheState(cache.getCacheAsArray());
      setPutKey('');
      setPutValue('');
    }
  };

  const handleGet = () => {
    if (getKey) {
      const value = cache.get(getKey);
      setGetValue(value);
      setCacheState(cache.getCacheAsArray());
    }
  };

  return (
    <div>
      <h2>LRU Cache</h2>
      <div>
        <h3>Put Value</h3>
        <input
          type="text"
          value={putKey}
          onChange={(e) => setPutKey(e.target.value)}
          placeholder="Key"
        />
        <input
          type="text"
          value={putValue}
          onChange={(e) => setPutValue(e.target.value)}
          placeholder="Value"
        />
        <button onClick={handlePut}>Put</button>
      </div>
      <div>
        <h3>Get Value</h3>
        <input
          type="text"
          value={getKey}
          onChange={(e) => setGetKey(e.target.value)}
          placeholder="Key"
        />
        <button onClick={handleGet}>Get</button>
        {getValue !== null && <p>Value: {getValue}</p>}
      </div>
      <div>
        <h3>Cache State</h3>
        <ul>
          {cacheState.map((item, index) => (
            <li key={index}>{`{${item.key}: ${item.value}}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LRUCacheComponent;