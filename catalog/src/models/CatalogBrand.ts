import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CatalogBrandAttrs {
    brand: string;
}

interface CatalogBrandDoc extends mongoose.Document {
    brand: string;
    version: number;
}

interface CatalogBrandModel extends mongoose.Model<CatalogBrandDoc> {
    build(attrs: CatalogBrandAttrs): CatalogBrandDoc;
}

const catalogBrandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
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


catalogBrandSchema.set('versionKey', 'version');
catalogBrandSchema.plugin(updateIfCurrentPlugin);

catalogBrandSchema.statics.build = (attrs: CatalogBrandAttrs) => {
    return new CatalogBrand(attrs);
};

const CatalogBrand = mongoose.model<CatalogBrandDoc, CatalogBrandModel>('CatalogBrand', catalogBrandSchema);

export { CatalogBrand, CatalogBrandDoc };
