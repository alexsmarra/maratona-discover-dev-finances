const Modal = {
    open() {
        document.querySelector(".modal-overlay")
            .classList.add("active")
    },

    close() {
        document.querySelector(".modal-overlay")
            .classList.remove("active")
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -5000,
        date: '01/01/2022'
    },
    {
        id: 2,
        description: 'Água',
        amount: -4000,
        date: '02/01/2022'
    },
    {
        id: 3,
        description: 'Website',
        amount: 1000000,
        date: '03/01/2022'
    },
    {
        id: 4,
        description: 'Mesa de escritório',
        amount: -20000,
        date: '04/01/2022'
    },
    {
        id: 5,
        description: 'App',
        amount: 1500000,
        date: '04/01/2022'
    }
]

const Transaction = {
    incomes() {
        let incomes = 0;

        transactions.forEach(transaction => {
            transaction.amount > 0 ? incomes += transaction.amount : ""
        })

        return incomes
    },
    
    expenses() {
        let expenses = 0;

        transactions.forEach(transaction => {
            transaction.amount < 0 ? expenses += transaction.amount : ""
        })

        return expenses
    },

    total() {
        let total = 0;

        total += this.incomes() + this.expenses()

        return total
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = this.innerHTMLTransaction(transaction)
        this.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {

        const CSSclass = transaction.amount > 0 ? 'incomeTable' : 'expenseTable'

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td>${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td>${transaction.date}</td>
            <td>
               <img src="./assets/minus.svg" alt="excluir item">
            </td>
        `

        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) > 0 ? "+" : "-"
        
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency"
        })

        return signal + value 
    }
}

transactions.forEach(transaction => {
    DOM.addTransaction(transaction)
})

DOM.updateBalance()