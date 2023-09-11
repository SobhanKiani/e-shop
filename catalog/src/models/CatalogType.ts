import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CatalogTypeAttrs {
    type: string;
}

interface CatalogTypeDoc extends mongoose.Document {
    type: string;
    version: number;
}

interface CatalogTypeModel extends mongoose.Model<CatalogTypeDoc> {
    build(attrs: CatalogTypeAttrs): CatalogTypeDoc;
}

const catalogTypeSchema = new mongoose.Schema({
    type: {
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


catalogTypeSchema.set('versionKey', 'version');
catalogTypeSchema.plugin(updateIfCurrentPlugin);

catalogTypeSchema.statics.build = (attrs: CatalogTypeAttrs) => {
    return new CatalogType(attrs);
};

const CatalogType = mongoose.model<CatalogTypeDoc, CatalogTypeModel>('CatalogType', catalogTypeSchema);

export { CatalogType, CatalogTypeDoc };
