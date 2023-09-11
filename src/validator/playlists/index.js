const InvariantError = require("../../exceptions/InvariantError");
const {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
} = require("./schema");

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validation = PlaylistPayloadSchema.validate(payload);
    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const validation = PlaylistSongPayloadSchema.validate(payload);
    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
