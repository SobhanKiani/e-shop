import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CatalogTypeDoc } from './CatalogType';
import { CatalogBrandDoc } from './CatalogBrand';

interface CatalogItemAttrs {
    name: string;
    description: string;
    price: number;
    pictureFileName: string;
    pictureUri: string;
    catalogType: CatalogTypeDoc;
    catalogBrand: CatalogBrandDoc;
    availableStock: number;
    restockThreshold: number;
    maxRestockThreshold: number;
    onReorder: boolean;
}

interface CatalogItemDoc extends mongoose.Document {
    name: string;
    description: string;
    price: number;
    pictureFileName: string;
    pictureUri: string;
    catalogType: CatalogTypeDoc;
    catalogBrand: CatalogBrandDoc;
    availableStock: number;
    restockThreshold: number;
    maxRestockThreshold: number;
    onReorder: boolean;
    version: number;
}

interface CatalogItemModel extends mongoose.Model<CatalogItemDoc> {
    build(attrs: CatalogItemAttrs): CatalogItemDoc;
}

const catalogItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pictureFileName: {
        type: String,
    },
    pictureURI: {
        type: String,
    },
    availableStock: {
        type: Number,
        require: true,
        min: 0,
        default: 0
    },
    restockThreshold: {
        type: Number,
        require: true,
        min: 0,
        default: 0
    },
    maxRestockThreshold: {
        type: Number,
        require: true,
        min: 0,
        default: 0
    },
    onReorder: {
        type: Boolean,
        require: true,
        default: false
    },
    catalogType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatalogType'
    },
    catalogBrand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatalogBrand'
    }

},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id
            },
            virtuals: true
        }
    }
);

catalogItemSchema.set('versionKey', 'version');
catalogItemSchema.plugin(updateIfCurrentPlugin);

catalogItemSchema.statics.build = (attrs: CatalogItemAttrs) => {
    return new CatalogItem(attrs);
}

const CatalogItem = mongoose.model<CatalogItemDoc, CatalogItemModel>('CatalogItem', catalogItemSchema);

export { CatalogItem, CatalogItemDoc };