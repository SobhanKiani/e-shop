import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { CatalogItem } from '../models/CatalogItem';
import { NotFoundError } from '@sobhankiani/e-shop-common';

const router = express.Router();

router.get('/api/items/withName/:name', async (req, res) => {
    const { name } = req.params;
    const pageSize = parseInt(req.query.pageSize as string) || 0
    const pageIndex = parseInt(req.query.pageSize as string) || 0

    const totalItems = await CatalogItem.countDocuments({ name: { $regex: `^${name}`, $options: 'i' } });

    const itemsOnPage = await CatalogItem.find({ name: { $regex: `^${name}`, $options: 'i' } })
        .skip(pageSize * pageIndex)
        .limit(pageSize);

    res.json({
        pageIndex,
        pageSize,
        totalItems,
        itemsOnPage,
    });
});

export { router as getItemsByNameRouter }