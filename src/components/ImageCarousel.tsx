import React, { useState } from 'react';

class Node {
  url: string;
  next: Node | null = null;
  prev: Node | null = null;

  constructor(url: string) {
    this.url = url;
  }
}

class CircularImageCarousel {
  private current: Node | null = null;

  addImage(url: string): void {
    const newNode = new Node(url);

    if (!this.current) {
      newNode.next = newNode;
      newNode.prev = newNode;
      this.current = newNode;
    } else {
      const last = this.current.prev!;
      last.next = newNode;
      newNode.prev = last;
      newNode.next = this.current;
      this.current.prev = newNode;
    }
  }

  nextImage(): string {
    if (!this.current) return '';
    this.current = this.current.next!;
    return this.current.url;
  }

  prevImage(): string {
    if (!this.current) return '';
    this.current = this.current.prev!;
    return this.current.url;
  }

  getCurrentImage(): string | null {
    return this.current ? this.current.url : null;
  }
}

// React Component
const ImageCarousel: React.FC = () => {
  const [carousel] = useState(new CircularImageCarousel());
  const [image, setImage] = useState<string | null>(null);

  const handleAdd = () => {
    const url = prompt('Enter image URL');
    if (url) {
      carousel.addImage(url);
      if (!image) setImage(url);
    }
  };

  const handleNext = () => {
    setImage(carousel.nextImage());
  };

  const handlePrev = () => {
    setImage(carousel.prevImage());
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Infinite Image Carousel</h2>
      {image ? (
        <img
          src={image}
          alt="Current"
          className="w-96 h-60 object-cover mx-auto mb-4 border"
        />
      ) : (
        <p className="mb-4">No images yet. Add one!</p>
      )}
      <div className="space-x-4">
        <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded">
          Add Image
        </button>
        <button onClick={handlePrev} className="px-4 py-2 bg-blue-500 text-white rounded">
          Prev
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next
        </button>
      </div>
      <hr></hr>
    </div>
  );
};

export default ImageCarousel;
