import dotenv from 'dotenv';
dotenv.config();

import bot from './services/bot';
bot();

import { app } from "./app";
app();
