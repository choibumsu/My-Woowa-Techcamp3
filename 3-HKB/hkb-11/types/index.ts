type Category = {
  id: number
  type?: string
  title?: string
}

type PaymentMethod = {
  id: number
  title?: string
}

type Invoice = {
  id?: number
  date: Date
  category: Category
  paymentMethod: PaymentMethod
  amount: number
  item: string
  userId?: string
}

export { Category, PaymentMethod, Invoice }
