import express from 'express';
import { CatalogItem } from '../models/CatalogItem';

const router = express.Router();

router.get('/api/items', async (req, res) => {

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageIndex = parseInt(req.query.pageIndex as string) || 0;
    const ids = req.query.ids as string;

    if (ids) {
        try {
            const items = await CatalogItem.find({ _id: { $in: ids.split(',') } });

            if (items.length === 0) {
                return res.status(400).send('ids value invalid. Must be comma-separated list of numbers');
            }

            return res.status(200).json(items);
        } catch (err) {
            return res.status(400).send('Error retrieving items by ids');
        }
    }

    try {
        const totalItems = await CatalogItem.countDocuments();
        const itemsOnPage = await CatalogItem.find()
            .sort({ Name: 1 })
            .skip(pageSize * pageIndex)
            .limit(pageSize);

        const model = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalItems: totalItems,
            items: itemsOnPage
        };

        return res.status(200).send(model);
    } catch (err) {
        return res.status(400).send('Error retrieving items');
    }
});

export { router as itemListRouter }