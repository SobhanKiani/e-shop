import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const cardTypesEnum = ['MasterCard', 'Visa', 'Ames']

interface CardTypeAttrs {
    name: string;
}

interface CardTypeDoc extends mongoose.Document {
    name: string;
    version: number;
}

interface CardTypeModel extends mongoose.Model<CardTypeDoc> {
    build(attrs: CardTypeAttrs): CardTypeDoc;
}

const CardTypeSchema = new mongoose.Schema({
    name: {
        enum: cardTypesEnum,
        type: String,
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
)


CardTypeSchema.set('versionKey', 'version');
CardTypeSchema.plugin(updateIfCurrentPlugin);


CardTypeSchema.statics.build = (attrs: CardTypeAttrs) => {
    return new CardType(attrs);
};

const CardType = mongoose.model<CardTypeDoc, CardTypeModel>('CardType', CardTypeSchema);

export { CardType, CardTypeDoc }