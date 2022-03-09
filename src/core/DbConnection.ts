import mongoose from 'mongoose';
import bluebird from "bluebird";
mongoose.Promise = bluebird;

const dbConnection = (() => {

  const connect = ({ connectionUri = "", configuraitons = {} } = {}) => {
    return mongoose.connect(connectionUri, configuraitons);
  }

  const disConnect = () => {
    return mongoose.disconnect();
  };


  return {
    connect,
    disConnect
  };

})();

export default dbConnection;
