// //TransactionExecutor.js
// import dbConnection from '../DbConnection';
// import customerDbConnection from '../CustomerDbConnection';
// import { Transaction } from 'sequelize';

// const executeTransaction = () => {
//     return dbConnection.connect().transaction({
//         isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
//     });
// };

// const customerTransaction = () => {
//     return customerDbConnection.connect().transaction({
//         isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
//     });
// };
// export {
//     executeTransaction,
//     customerTransaction
// };
