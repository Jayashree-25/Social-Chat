import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;

//middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI, {
    useNewParser : true,
    useUnifiedTopology : true,
}).then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Running at port ${PORT}`));
}).catch((err) => console.error("error in MongoDB connection"));