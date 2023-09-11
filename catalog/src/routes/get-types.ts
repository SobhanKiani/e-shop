import express, { Request, Response } from 'express';
import { CatalogType } from '../models/CatalogType';


const router = express.Router();

router.get('/api/items/types', async (req, res) => {
    const types = await CatalogType.find({})
    res.send(types);
});

export { router as getTypesRouter }