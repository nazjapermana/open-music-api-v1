const InvariantError = require("../../exceptions/InvariantError");
const { UserPayloadSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validation = UserPayloadSchema.validate(payload);
    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  },
};

module.exports = UsersValidator;
