// ANGIE MELISSA SANTIAGO RODRIGUEZ
class Order {
    constructor(
        public company: string,
        public quantity: number,
        public price: number,
        public type: "buy" | "sell"
    ) {}
}

class MaxHeap {
    public heap: Order[];
    private n: number;

    constructor(size: number) {
        this.heap = new Array(size + 1);
        this.n = 0;
    }

    public CheckMax(): Order {
        return this.heap[1];
    }

    public Empty(): boolean {
        return this.n === 0;
    }

    public GetQuantity(): number {
        return this.n;
    }

    public Insert(value: Order): void {
        if (this.n === this.heap.length - 1) {
            this.Resize(2 * this.heap.length);
        }
        this.n++;
        this.heap[this.n] = value;
        this.BubbleUp(this.n);
    }

    private BubbleUp(i: number): void {
        let parent = Math.floor(i / 2);
        while (i > 1 && this.heap[parent].price < this.heap[i].price) {
            [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
            i = parent;
            parent = Math.floor(i / 2);
        }
    }

    public GetMax(): Order {
        let max = this.heap[1];
        this.heap[1] = this.heap[this.n];
        this.heap[this.n] = undefined as any;
        this.n--;
        this.Sink(1);
        return max;
    }

    private Sink(i: number): void {
        while (2 * i <= this.n) {
            let j = 2 * i;
            if (j < this.n && this.heap[j].price < this.heap[j + 1].price) j++;
            if (this.heap[i].price >= this.heap[j].price) break;
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
    private heap: Order[];
    private n: number;

    constructor(size: number) {
        this.heap = new Array(size + 1);
        this.n = 0;
    }

    public CheckMin(): Order {
        return this.heap[1];
    }

    public Empty(): boolean {
        return this.n === 0;
    }

    public GetQuantity(): number {
        return this.n;
    }

    public Insert(value: Order): void {
        if (this.n === this.heap.length - 1) {
            this.Resize(2 * this.heap.length);
        }
        this.n++;
        this.heap[this.n] = value;
        this.BubbleUp(this.n);
    }

    private BubbleUp(i: number): void {
        let parent = Math.floor(i / 2);
        while (i > 1 && this.heap[parent].price > this.heap[i].price) {
            [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
            i = parent;
            parent = Math.floor(i / 2);
        }
    }

    public GetMin(): Order {
        let min = this.heap[1];
        this.heap[1] = this.heap[this.n];
        this.heap[this.n] = undefined as any;
        this.n--;
        this.Sink(1);
        return min;
    }

    private Sink(i: number): void {
        while (2 * i <= this.n) {
            let j = 2 * i;
            if (j < this.n && this.heap[j].price > this.heap[j + 1].price) j++;
            if (this.heap[i].price <= this.heap[j].price) break;
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

class StockMarketSimulator {
    private buyOrders: MaxHeap;
    private sellOrders: MinHeap;
    private transactionHistory: { company: string; quantity: number; price: number; total: number }[] = [];

    constructor() {
        this.buyOrders = new MaxHeap(10);
        this.sellOrders = new MinHeap(10);
    }

    public AddOrder(order: Order): void {
        if (order.type === "buy") {
            this.buyOrders.Insert(order);
            this.LogTransaction(order.company, order.quantity, order.price, "buy");
        } else {
            this.sellOrders.Insert(order);
            this.LogTransaction(order.company, order.quantity, order.price, "sell");
        }
        this.MatchOrders();
    }

    private MatchOrders(): void {
        while (!this.buyOrders.Empty() && !this.sellOrders.Empty()) {
            let highestBuyOrder = this.buyOrders.CheckMax();
            let lowestSellOrder = this.sellOrders.CheckMin();

            if (highestBuyOrder.price >= lowestSellOrder.price) {
                let quantityMatched = Math.min(highestBuyOrder.quantity, lowestSellOrder.quantity);

                highestBuyOrder.quantity -= quantityMatched;
                lowestSellOrder.quantity -= quantityMatched;

                this.LogTransaction(highestBuyOrder.company, quantityMatched, lowestSellOrder.price, "match");
                if (highestBuyOrder.quantity === 0) {
                    this.buyOrders.GetMax();
                }
                if (lowestSellOrder.quantity === 0) {
                    this.sellOrders.GetMin();
                }
            } else {
                break;
            }
        }
    }

    private LogTransaction(company: string, quantity: number, price: number, type: string): void {
        let total = quantity * price;
        this.transactionHistory.push({ company, quantity, price, total });
    }

    public ShowTransactionHistory(): void {
        console.log("\n--------- MERCADO DE ACCIONES ---------")
        console.log("\nHISTORIAL DE TRANSACCIONES");
        this.transactionHistory.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones Compradas: ${transaction.quantity}`);
            console.log(`Precio de la Acción: ${transaction.price}`);
            console.log(`Total Invertido: ${transaction.total.toFixed(2)}`);
            
        });

        this.ShowOrderedTransactions();
    }
    
    private ShowOrderedTransactions(): void {
        let sortedTransactionsDesc = [...this.transactionHistory].sort((a, b) => b.total - a.total);
        console.log("\n-----------------------------------------------")
        console.log("\nTRANSACCIONES ORDENADAS DE MAYOR A MENOR");
        sortedTransactionsDesc.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones Compradas: ${transaction.quantity}`);
            console.log(`Precio de la Acción: ${transaction.price}`);
            console.log(`Total Invertido: ${transaction.total.toFixed(2)}`);
            
        });

        let sortedTransactionsAsc = [...this.transactionHistory].sort((a, b) => a.total - b.total);
        console.log("\n-----------------------------------------------")
        console.log("\nTRANSACCIONES ORDENADAS DE MENOR A MAYOR");
        sortedTransactionsAsc.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones Compradas: ${transaction.quantity}`);
            console.log(`Precio de la Acción: ${transaction.price}`);
            console.log(`Total Invertido: ${transaction.total.toFixed(2)}`);
            
        });
    }
}

const simulator = new StockMarketSimulator();
//COMPRAR ACCIONES
simulator.AddOrder(new Order("Apple", 50, 227.50, "buy"));
simulator.AddOrder(new Order ("Microsoft", 30, 431.30, "buy"))
simulator.AddOrder(new Order ("Activision", 12, 94.40, "buy"))
simulator.AddOrder(new Order ("Alphabet", 15, 163.80, "buy"))
simulator.AddOrder(new Order ("Meta Platforms", 52, 567.80, "buy"))

// VENDER ACCIONES
simulator.AddOrder(new Order("Apple", 40, 250.00, "sell"));

simulator.ShowTransactionHistory();
