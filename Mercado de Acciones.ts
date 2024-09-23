// ANGIE MELISSA SANTIAGO RODRIGUEZ

class MaxHeap {
    public heap: number[];
    private n: number;

    constructor(size: number) {
        this.heap = new Array(size + 1);
        this.n = 0;
    }

    public CheckMax(): number {
        return this.heap[1];
    }

    public Empty(): boolean {
        return this.n === 0;
    }

    public GetQuantity(): number {
        return this.n;
    }

    public Insert(value: number): void {
        if (this.n === this.heap.length - 1) {
            this.Resize(2 * this.heap.length);
        }
        this.n++;
        this.heap[this.n] = value;
        this.BubbleUp(this.n);
    }

    private BubbleUp(i: number): void {
        let parent = Math.floor(i / 2);
        while (i > 1 && this.heap[parent] < this.heap[i]) {
            [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
            i = parent;
            parent = Math.floor(i / 2);
        }
    }

    public GetMax(): number {
        let max = this.heap[1];
        this.heap[1] = this.heap[this.n];
        this.heap[this.n] = 0;
        this.n--;
        this.Sink(1);
        return max;
    }

    private Sink(i: number): void {
        while (2 * i <= this.n) {
            let j = 2 * i;
            if (j < this.n && this.heap[j] < this.heap[j + 1]) j++;
            if (this.heap[i] >= this.heap[j]) break;
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
            i = j;
        }
    }

    private Resize(newSize: number): void {
        let newHeap = new Array(newSize);
        for (let i = 1; i <= this.n; i++) {
            newHeap[i] = this.heap[i];
        }
        this.heap = newHeap;
    }
}


class MinHeap {
    private heap: number[];
    private n: number;

    constructor(size: number) {
        this.heap = new Array(size + 1);
        this.n = 0;
    }

    public CheckMin(): number {
        return this.heap[1];
    }

    public Empty(): boolean {
        return this.n === 0;
    }

    public GetQuantity(): number {
        return this.n;
    }

    public Insert(value: number): void {
        if (this.n === this.heap.length - 1) {
            this.Resize(2 * this.heap.length);
        }
        this.n++;
        this.heap[this.n] = value;
        this.BubbleUp(this.n);
    }

    private BubbleUp(i: number): void {
        let parent = Math.floor(i / 2);
        while (i > 1 && this.heap[parent] > this.heap[i]) {
            [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
            i = parent;
            parent = Math.floor(i / 2);
        }
    }

    public GetMin(): number {
        let min = this.heap[1];
        this.heap[1] = this.heap[this.n];
        this.heap[this.n] = 0;
        this.n--;
        this.Sink(1);
        return min;
    }

    private Sink(i: number): void {
        while (2 * i <= this.n) {
            let j = 2 * i;
            if (j < this.n && this.heap[j] > this.heap[j + 1]) j++;
            if (this.heap[i] <= this.heap[j]) break;
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
            i = j;
        }
    }

    private Resize(newSize: number): void {
        let newHeap = new Array(newSize);
        for (let i = 1; i <= this.n; i++) {
            newHeap[i] = this.heap[i];
        }
        this.heap = newHeap;
    }

    public Print(): void {
        let tree = "";
        for (let i = 1; i <= this.n; i++) {
            tree += "[" + this.heap[i] + "] ";
        }
        console.log(tree);
    }
}

