const InvariantError = require("../../exceptions/InvariantError");
const { CollaborationPayloadSchema } = require("./schema");

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validation = CollaborationPayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
