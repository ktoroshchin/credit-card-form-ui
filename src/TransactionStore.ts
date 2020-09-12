
class TransactionStore {
    private transactions: any = []

    public addTransaction(data: any) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.transactions.push(data)
                resolve(true)
            }, 2000)
        })  
    }

    public get values() {
        return this.transactions
    }
}

export const transacionStore: TransactionStore = new TransactionStore() 