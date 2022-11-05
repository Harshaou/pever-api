import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountSchema = new Schema({
  email: String,
  username: String,
  availability: Array,
  booking: {
    incoming: [],
    outgoing: [],
    scheduled: [],
  },
  pricing: Object,
});

// Duplicate the ID field.
accountSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
accountSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
