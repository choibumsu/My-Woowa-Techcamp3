import { Request, Response } from 'express'
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'
import { Invoice } from '../../types'
import pool from '../pool'
import query from '../query'

function formatMYSQLDate(date: Date) {
  return `${new Date(date).toISOString().slice(0, 10)} ${new Date(
    date
  ).toLocaleTimeString('en-GB')}`
}

const formatInvoice = (invoice): Invoice => {
  const {
    id,
    date,
    amount,
    item,
    userId,
    categoryId,
    paymentMethodId,
  } = invoice
  return {
    id,
    date,
    amount,
    item,
    userId,
    category: {
      id: categoryId,
    },
    paymentMethod: {
      id: paymentMethodId,
    },
  }
}

const getInvoiceList = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query
    const [rows] = await pool.query<RowDataPacket[]>(
      query.SELECT_INVOICE_LIST,
      [req.auth.id, year, month]
    )
    res.json({
      invoiceList: rows.map(formatInvoice),
    })
  } catch (e) {
    res.status(500).json({
      message: e,
    })
  }
}
const postInvoice = async (req: Request, res: Response) => {
  try {
    const { invoice }: { invoice: Invoice } = req.body
    const { date, item, amount, category, paymentMethod } = invoice
    const [row] = await pool.query<OkPacket>(query.INSERT_INVOICE, [
      req.auth.id,
      formatMYSQLDate(date),
      category.id,
      paymentMethod.id,
      item,
      amount,
    ])
    res.json({
      invoiceId: row.insertId,
    })
  } catch (e) {
    res.status(500).json({
      message: e,
    })
  }
}

const putInvoice = async (req: Request, res: Response) => {
  try {
    const { invoice }: { invoice: Invoice } = req.body
    const { id, date, category, paymentMethod, item, amount } = invoice

    const [row] = await pool.query<RowDataPacket[]>(query.SELECT_INVOICE, [id])
    if (row.length === 0) {
      res.status(404).json()
      return
    }

    const [result] = await pool.query<ResultSetHeader>(query.UPDATE_INVOICE, [
      formatMYSQLDate(date),
      category.id,
      paymentMethod.id,
      item,
      amount,
      id,
    ])

    // 변경된 사항이 없다면(수정된 것이 없다면) Error를 발생시켜 500 리턴
    if (result.affectedRows === 0) {
      throw Error('no change')
    }

    res.status(200).json()
  } catch (e) {
    res.status(500).json({
      message: e,
    })
  }
}

const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const {
      invoice: { id },
    } = req.body

    // 삭제할 Invoice가 있는지 검사, false: 404
    const [row] = await pool.query<RowDataPacket[]>(query.SELECT_INVOICE, [id])
    if (row.length === 0) {
      res.status(404).json()
      return
    }

    const [result] = await pool.query<ResultSetHeader>(
      query.DELETE_INVOICE_METHOD,
      [id]
    )

    // 변경된 사항이 없다면(삭제된 것이 없다면) Error를 발생시켜 500 리턴
    if (result.affectedRows === 0) {
      throw Error('no change')
    }

    res.status(200).json()
  } catch (e) {
    res.status(500).json({
      message: e,
    })
  }
}

export default {
  getInvoiceList,
  postInvoice,
  putInvoice,
  deleteInvoice,
}
