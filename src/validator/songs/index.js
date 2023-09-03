const InvariantError = require("../../exceptions/InvariantError");
const { SongPayloadSchema } = require("./schema");

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validation = SongPayloadSchema.validate(payload);

    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  },
};

module.exports = SongsValidator;
