const queries = {
  SELECT_CATEGORY_LIST: `SELECT * FROM Category`,
  SELECT_PAYMENT_METHOD_LIST: `SELECT * FROM PaymentMethod WHERE userId=?`,
  SELECT_PAYMENT_METHOD: `SELECT * FROM PaymentMethod WHERE id=?`,
  INSERT_PAYMENT_METHOD: `INSERT INTO PaymentMethod (title, userId) VALUES (?, ?)`,
  DELETE_PAYMENT_METHOD: `DELETE FROM PaymentMethod WHERE id=?`,
  SELECT_INVOICE_LIST: `SELECT * FROM Invoice WHERE userId=? AND YEAR(date)=? AND MONTH(date)=?`,
  SELECT_INVOICE: `SELECT * FROM Invoice WHERE id=?`,
  INSERT_INVOICE:
    'INSERT INTO Invoice (userId, date, categoryId, paymentMethodId, item, amount) VALUES (?, ?, ?, ?, ?, ?)',
  UPDATE_INVOICE:
    'UPDATE Invoice SET date=?, categoryId=?, paymentMethodId=?, item=?, amount=? WHERE id=?',
  DELETE_INVOICE_METHOD: `DELETE FROM Invoice WHERE id=?`,
}
export default queries
