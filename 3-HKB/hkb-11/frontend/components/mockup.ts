import { Category, Invoice, PaymentMethod } from '../../types'

export const mockupCategory: Array<Category> = [
  {
    id: 1,
    title: '식비',
    type: '지출',
  },
  {
    id: 2,
    title: '교통비',
    type: '지출',
  },
  {
    id: 3,
    title: '생활비',
    type: '지출',
  },
  {
    id: 4,
    title: '월급',
    type: '수입',
  },
  {
    id: 5,
    title: '용돈',
    type: '수입',
  },
]

export const mockupPayment: Array<PaymentMethod> = [
  {
    id: 1,
    title: '삼성페이',
  },
  {
    id: 2,
    title: '롯데카드',
  },
  {
    id: 3,
    title: '페이코',
  },
  {
    id: 4,
    title: '토스',
  },
  {
    id: 5,
    title: '카카오페이',
  },
]

const mockup: Array<Invoice> = [
  {
    id: 1,
    date: new Date('2020-08-01T03:24:00'),
    category: {
      id: 1,
    },
    paymentMethod: {
      id: 1,
    },
    amount: 10000,
    item: '버거킹',
  },
  {
    id: 2,
    date: new Date('2020-08-01T05:24:00'),
    category: {
      id: 2,
    },
    paymentMethod: {
      id: 1,
    },
    amount: 5000,
    item: '메가치킨마요는너무맛있어',
  },
  {
    id: 3,
    date: new Date('2020-08-01T11:24:00'),
    category: {
      id: 3,
    },
    paymentMethod: {
      id: 1,
    },
    amount: 5200,
    item: '버거킹',
  },
  {
    id: 4,
    date: new Date('2020-08-02T03:24:00'),
    category: {
      id: 4,
    },
    paymentMethod: {
      id: 1,
    },
    amount: 10000,
    item: '',
  },
  {
    id: 5,
    date: new Date('2020-08-01T03:26:00'),
    category: {
      id: 5,
    },
    paymentMethod: {
      id: 1,
    },
    amount: 1700,
    item: '대추차',
  },
  {
    id: 6,
    date: new Date('2020-08-03T03:24:00'),
    category: {
      id: 1,
    },
    paymentMethod: {
      id: 1,
    },
    amount: 2414,
    item: '이히히',
  },
  {
    id: 7,
    date: new Date('2020-08-06T03:24:00'),
    category: {
      id: 2,
    },
    paymentMethod: {
      id: 1,
    },
    amount: 1,
    item: '은행이자',
  },
]
export default mockup
