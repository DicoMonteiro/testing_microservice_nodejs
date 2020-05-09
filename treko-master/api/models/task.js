import mongoose from 'mongoose';

let Task = new mongoose.Schema({
    title: {
        type: String,
        // Definindo obrigatoriedade no campo
        required: [true, 'Oops! Title is required.'],
        // Definindo a unicidade do registro
        unique: true
    },
    owner: {
        type: String,
        // Definindo obrigatoriedade no campo
        required: [true, 'Oops! Owner is required.']
    },
    done: Boolean
});

export default mongoose.model('Task', Task);