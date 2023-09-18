import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface AddressAttrs {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface AddressDoc extends mongoose.Document {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    version: number;
}

interface AddressModel extends mongoose.Model<AddressDoc> {
    build(attrs: AddressAttrs): AddressDoc;
}

const AddressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
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


AddressSchema.set('versionKey', 'version');
AddressSchema.plugin(updateIfCurrentPlugin);


AddressSchema.statics.build = (attrs: AddressAttrs) => {
    return new Address(attrs);
};

const Address = mongoose.model<AddressDoc, AddressModel>('Address', AddressSchema);

export { Address, AddressDoc }