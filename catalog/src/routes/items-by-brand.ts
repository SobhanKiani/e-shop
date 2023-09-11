import express, { Request, Response } from 'express';
import { CatalogItem } from '../models/CatalogItem';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/api/items/type/all/brand/:brand', async (req, res) => {
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageIndex = parseInt(req.query.pageIndex as string) || 0;

    const { brand } = req.params
    let query = { catalogBrand: mongoose.Types.ObjectId(brand) };

    const itemsOnPage = await CatalogItem.find(query)
        .skip(pageSize * pageIndex)
        .limit(pageSize);
    const totalItems = itemsOnPage.length;

    const model = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItems: totalItems,
        items: itemsOnPage
    };

    res.send(model);
})


export { router as getItemsByBrand }