import * as mongoose from 'mongoose';
import {IRole} from '../../interface/IRole';

const roleSchema = new mongoose.Schema({
    roleName:{
        type: String,
    },
    permissions: {
        type: Array,
    }
    
    
});

const User = mongoose.model<IRole & mongoose.Document>('Role', roleSchema);
export default User;