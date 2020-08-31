import { Request, Response } from 'express'
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'
import pool from '../pool'
import query from '../query'

const getPaymentMethodList = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(query.SELECT_PAYMENT_METHOD_LIST, [
      req.auth.id,
    ])
    res.json({
      paymentMethodList: rows,
    })
  } catch (e) {
    res.status(500).json({
      message: e,
    })
  }
}

const postPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { title } = req.body

    const [row] = await pool.query<OkPacket>(query.INSERT_PAYMENT_METHOD, [
      title,
      req.auth.id,
    ])

    res.json({
      paymentMethodId: row.insertId,
    })
  } catch (e) {
    res.status(500).json({
      message: e,
    })
  }
}

const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    // 삭제할 paymentMethod가 있는지 검사, false: 404
    const [row] = await pool.query<RowDataPacket[]>(
      query.SELECT_PAYMENT_METHOD,
      [id]
    )
    if (row.length === 0) {
      res.status(404).json()
      return
    }

    const [result] = await pool.query<ResultSetHeader>(
      query.DELETE_PAYMENT_METHOD,
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
  getPaymentMethodList,
  postPaymentMethod,
  deletePaymentMethod,
}
