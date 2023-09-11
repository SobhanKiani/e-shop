import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { CatalogItem } from '../models/CatalogItem';
import { NotFoundError } from '@sobhankiani/e-shop-common';

const router = express.Router();

router.get("/api/items/:id", [query('id').isMongoId()], async (req, res) => {
    const id = req.params.id as string;
    const item = await CatalogItem.findById(id);

    if (!item) {
        throw new NotFoundError();
    }

    res.status(200).send(item)
})

export { router as getItemByIdRouter }