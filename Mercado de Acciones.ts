//ANGIE MELISSA SANTIAGO RODRIGUEZ - 1555123
//ESTRUCTURA DE DATOS II
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

    //OBTIENE EL ELEMENTO MAXIMO DEL MONTICULO
    public CheckMax(): Order {
        return this.heap[1];
    }

    //VERIFICA SI EL MONTICULO ESTA VACIO
    public Empty(): boolean {
        return this.n === 0;
    }

    //DEVUELVE LA CANTIDAD DE ELEMENTOS DEL MONTICULO
    public GetQuantity(): number {
        return this.n;
    }

    //INSERTA UN ELEMENTO EN EL MONTICULO
    public Insert(value: Order): void {
        if (this.n === this.heap.length - 1) {
            this.Resize(2 * this.heap.length);
        }
        this.n++;
        this.heap[this.n] = value;
        this.BubbleUp(this.n);
    }

    //ORDENA EL ELEMENTO HACIA ARRIBA SEGUN SU PRIORIDAD
    private BubbleUp(i: number): void {
        let parent = Math.floor(i / 2);
        while (i > 1 && this.heap[parent].price < this.heap[i].price) {
            [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
            i = parent;
            parent = Math.floor(i / 2);
        }
    }

    //OBTIENE EL VALOR MAXIMO DEL MONTICULO Y LO ELIMINA
    public GetMax(): Order {
        let max = this.heap[1];
        this.heap[1] = this.heap[this.n];
        this.heap[this.n] = undefined as any;
        this.n--;
        this.Sink(1);
        return max;
    }

    //ORDENA EL ELEMENTO HACIA ABAJO SEGUN SU PRIORIDAD
    private Sink(i: number): void {
        while (2 * i <= this.n) {
            let j = 2 * i;
            if (j < this.n && this.heap[j].price < this.heap[j + 1].price) j++;
            if (this.heap[i].price >= this.heap[j].price) break;
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
            i = j;
        }
    }

    //REDIMENSIONA EL ARREGLO
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

    //OBTIENE EL ELEMENTO MINIMO DEL MONTICULO
    public CheckMin(): Order {
        return this.heap[1];
    }

    //VERIFICA SI EL MONTICULO ESTA VACIO
    public Empty(): boolean {
        return this.n === 0;
    }

    //DEVUELVE LA CANTIDAD DE ELEMENTOS DEL MONTICULO
    public GetQuantity(): number {
        return this.n;
    }

    //INSERTA UN ELEMENTO EN EL MONTICULO 
    public Insert(value: Order): void {
        if (this.n === this.heap.length - 1) {
            this.Resize(2 * this.heap.length);
        }
        this.n++;
        this.heap[this.n] = value;
        this.BubbleUp(this.n);
    }

    //ORDENA EL ELEMENTO HACIA ARRIBA SEGUN SU PRIORIDAD
    private BubbleUp(i: number): void {
        let parent = Math.floor(i / 2);
        while (i > 1 && this.heap[parent].price > this.heap[i].price) {
            [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
            i = parent;
            parent = Math.floor(i / 2);
        }
    }

    //OBTIENE EL ELEMENTO MINIMO DEL MONTICULO Y LO ELIMINA
    public GetMin(): Order {
        let min = this.heap[1];
        this.heap[1] = this.heap[this.n];
        this.heap[this.n] = undefined as any;
        this.n--;
        this.Sink(1);
        return min;
    }

    //ORDENA EL ELEMENTO HACIA ABAJO SEGUN SU PRIORIDAD
    private Sink(i: number): void {
        while (2 * i <= this.n) {
            let j = 2 * i;
            if (j < this.n && this.heap[j].price > this.heap[j + 1].price) j++;
            if (this.heap[i].price <= this.heap[j].price) break;
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
            i = j;
        }
    }

    //REDIMENSIONA EL ARREGLO
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
    private transactionHistory: { company: string; quantity: number; price: number; total: number; type: string }[] = [];

    constructor() {
        this.buyOrders = new MaxHeap(10);
        this.sellOrders = new MinHeap(10);
    }

    //AGREGA UNA ORDEN 
    public AddOrder(order: Order): void {
        if (order.type === "buy") {
            this.buyOrders.Insert(order);
        } else {
            this.sellOrders.Insert(order);
        }
        this.LogTransaction(order.company, order.quantity, order.price, order.type);
        this.MatchOrders();
    }

    //HACE MATCH ENTRE LAS ORDENES DE COMPRA Y VENTA
    private MatchOrders(): void {
        while (!this.buyOrders.Empty() && !this.sellOrders.Empty()) {
            let highestBuyOrder = this.buyOrders.CheckMax();
            let lowestSellOrder = this.sellOrders.CheckMin();

            if (highestBuyOrder.price >= lowestSellOrder.price && highestBuyOrder.company === lowestSellOrder.company) {
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

    //AGREGA UNA TRANSACCION EN EL HISTORIAL
    private LogTransaction(company: string, quantity: number, price: number, type: string): void {
        let total = quantity * price;
        this.transactionHistory.push({ company, quantity, price, total, type });
    }

    //MUESTRA EL HISTORIAL DE TRANSACCIONES
    public ShowTransactionHistory(): void {
        console.log("\n-------------- MERCADO DE ACCIONES --------------");
        console.log("\nHISTORIAL DE TRANSACCIONES");
        this.transactionHistory.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones: ${transaction.quantity}`);
            console.log(`Precio: ${transaction.price}`);
            console.log(`Total: ${transaction.total.toFixed(2)}`);
        });

        this.ShowOrderedTransactions();
    }

    //MOSTRAR LAS TRANSACCIONES ORDENADAS DE DIFERENTES MANERAS
    private ShowOrderedTransactions(): void {
        let buyTransactions = this.transactionHistory.filter(t => t.type === "buy");
        let sellTransactions = this.transactionHistory.filter(t => t.type === "sell");

        let sortedBuysDesc = [...buyTransactions].sort((a, b) => b.total - a.total);
        let sortedSellsDesc = [...sellTransactions].sort((a, b) => b.total - a.total);

        let sortedBuysAsc = [...buyTransactions].sort((a, b) => a.total - b.total);
        let sortedSellsAsc = [...sellTransactions].sort((a, b) => a.total - b.total);

        //TRANSACCIONES DE COMPRA ORDENADAS DE MAYOR A MENOR
        console.log("\n-----------------------------------------------------");
        console.log("\nTRANSACCIONES DE COMPRAS ORDENADAS DE MAYOR A MENOR");
        sortedBuysDesc.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones Compradas: ${transaction.quantity}`);
            console.log(`Precio de la Acción: ${transaction.price}`);
            console.log(`Total Invertido: ${transaction.total.toFixed(2)}`);
        });

        //QUITAR COMENTARIOS SI DESEA VER LAS COMPRAS ORDENADAS DE MENOR A MAYOR
        //TRANSACCIONES DE COMPRA ORDENADAS DE MENOR A MAYOT
        /*console.log("\n-----------------------------------------------------");
        console.log("\nTRANSACCIONES DE COMPRAS ORDENADAS DE MENOR A MAYOR");
        sortedBuysAsc.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones Compradas: ${transaction.quantity}`);
            console.log(`Precio de la Acción: ${transaction.price}`);
            console.log(`Total Invertido: ${transaction.total.toFixed(2)}`);
        });*/

        //TRANSACCIONES DE VENTA ORDENADAS DE MAYOR A MENOR
        console.log("\n--------------------------------------------------");
        console.log("\nTRANSACCIONES DE VENTAS ORDENADAS DE MAYOR A MENOR");
        sortedSellsDesc.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones Vendidas: ${transaction.quantity}`);
            console.log(`Precio de la Acción: ${transaction.price}`);
            console.log(`Total Ganado: ${transaction.total.toFixed(2)}`);
        });

        //QUITAR COMENTARIOS SI DESEA VER LAS VENTAS ORDENADAS DE MENOR A MAYOR
        //TRANSACCIONES DE VENTA ORDENADAS DE MENOR A MAYOR
        /*console.log("\n--------------------------------------------------");
        console.log("\nTRANSACCIONES DE VENTAS ORDENADAS DE MENOR A MAYOR");
        sortedSellsAsc.forEach(transaction => {
            console.log(`\nCompañía: ${transaction.company}`);
            console.log(`Acciones Vendidas: ${transaction.quantity}`);
            console.log(`Precio de la Acción: ${transaction.price}`);
            console.log(`Total Ganado: ${transaction.total.toFixed(2)}`);
        });*/
    }

    //MOSTRAR COMPRA Y VENTA MAYOR USANDO MONTICULOS
    public MostrarCompraMayor(): void {
        let maxHeap = new MaxHeap(this.buyOrders.GetQuantity());
        this.transactionHistory.filter(t => t.type === "buy").forEach(transaction => {
            maxHeap.Insert(new Order(transaction.company, transaction.quantity, transaction.price, "buy"));
        });

        let maxCompra = maxHeap.GetMax();
        console.log("\n--------------------------------------------------");
        console.log("\nCOMPRA MAYOR");
        console.log(`\nCompañía: ${maxCompra.company}`);
        console.log(`Acciones: ${maxCompra.quantity}`);
        console.log(`Precio: ${maxCompra.price}`);
    }

    public MostrarCompraMenor(): void {
        let minHeap = new MinHeap(this.buyOrders.GetQuantity());
        this.transactionHistory.filter(t => t.type === "buy").forEach(transaction => {
            minHeap.Insert(new Order(transaction.company, transaction.quantity, transaction.price, "buy"));
        });

        let minCompra = minHeap.GetMin();
        console.log("\n--------------------------------------------------");
        console.log("\nCOMPRA MENOR");
        console.log(`\nCompañía: ${minCompra.company}`);
        console.log(`Acciones: ${minCompra.quantity}`);
        console.log(`Precio: ${minCompra.price}`);
    }

    public MostrarVentaMayor(): void {
        let maxHeap = new MaxHeap(this.sellOrders.GetQuantity());
        this.transactionHistory.filter(t => t.type === "sell").forEach(transaction => {
            maxHeap.Insert(new Order(transaction.company, transaction.quantity, transaction.price, "sell"));
        });

        let maxVenta = maxHeap.GetMax();
        console.log("\n--------------------------------------------------");
        console.log("\nVENTA MAYOR");
        console.log(`\nCompañía: ${maxVenta.company}`);
        console.log(`Acciones: ${maxVenta.quantity}`);
        console.log(`Precio: ${maxVenta.price}`);
    }

    public MostrarVentaMenor(): void {
        let minHeap = new MinHeap(this.sellOrders.GetQuantity());
        this.transactionHistory.filter(t => t.type === "sell").forEach(transaction => {
            minHeap.Insert(new Order(transaction.company, transaction.quantity, transaction.price, "sell"));
        });

        let minVenta = minHeap.GetMin();
        console.log("\n--------------------------------------------------");
        console.log("\nVENTA MENOR");
        console.log(`\nCompañía: ${minVenta.company}`);
        console.log(`Acciones: ${minVenta.quantity}`);
        console.log(`Precio: ${minVenta.price}`);
    }
}

const simulator = new StockMarketSimulator();

//COMPRAR ACCIONES
simulator.AddOrder(new Order("Apple", 50, 227.50, "buy"));
simulator.AddOrder(new Order("Microsoft", 30, 431.30, "buy"));
simulator.AddOrder(new Order("Activision", 12, 94.40, "buy"));
simulator.AddOrder(new Order("Alphabet", 15, 163.80, "buy"));
simulator.AddOrder(new Order("Meta Platforms", 52, 567.80, "buy"));

//VENDER ACCIONES
simulator.AddOrder(new Order("Apple", 40, 250.00, "sell"));
simulator.AddOrder(new Order("Microsoft", 15, 450.00, "sell"));
simulator.AddOrder(new Order("Activision", 2, 100.00, "sell"));
simulator.AddOrder(new Order("Alphabet", 5, 175.0, "sell"));
simulator.AddOrder(new Order("Meta Platforms", 2, 575.00, "sell"));

simulator.ShowTransactionHistory();

//MOSTRAR COMPRA MAYOR Y MENOR USANDO MONTICULOS
simulator.MostrarCompraMayor();
simulator.MostrarCompraMenor();

//MOSTRAR VENTA MAYOR Y MENOR USANDO MONTICULOS
simulator.MostrarVentaMayor();
simulator.MostrarVentaMenor();