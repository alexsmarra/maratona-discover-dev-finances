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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    }, 

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {

    all: Storage.get(),

    add(transaction) {
        this.all.push(transaction)
        console.log(this.all)
        App.reload()
    },

    remove(index) {
        this.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let incomes = 0;

        this.all.forEach(transaction => {
            transaction.amount > 0 ? incomes += transaction.amount : ""
        })

        return incomes
    },
    
    expenses() {
        let expenses = 0;

        this.all.forEach(transaction => {
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
        tr.innerHTML = this.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        this.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? 'incomeTable' : 'expenseTable'

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="${CSSclass}">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td>${transaction.date}</td>
            <td>
               <img class="pointer" onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="excluir item">
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
    },

    totalCardColor() {
        if (Transaction.total() > 0) {
            document.querySelector('.card.total').style.backgroundColor = "#7BD389"
        } else {
            document.querySelector('.card.total').style.backgroundColor = "#FA9F9E" 
        }
    },

    clearTransactions() {
        this.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) >= 0 ? "+" : "-"
        
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency"
        })

        return signal + value 
    },

    formatAmount(value) {
        value = Number(value) * 100
        return Math.round(value) 
    },

    formatDate(value) {
        const splittedDate = value.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = this.getValues()

        if( description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === ""    
        ) {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = this.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return { description, amount, date }
    },

    clearFields() {
        this.description.value = "",
        this.amount.value = "",
        this.date.value = ""
    },
    
    submit(event) {
        event.preventDefault()

        try {
            this.validateFields()

            const transaction = this.formatValues()

            Transaction.add(transaction)

            this.clearFields()

            Modal.close()

        } catch(err) {
            alert(err.message)
        }
    }
}

const App = {
    
    init() {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        DOM.totalCardColor()

        Storage.set(Transaction.all)
    },
    
    reload() {
        DOM.clearTransactions()
        this.init()
    }
}

App.init()




