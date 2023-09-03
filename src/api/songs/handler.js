const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan",
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();

    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: "success",
      data: {
        song,
      },
    });

    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.updateSongById(id, request.payload);

    return h.response({
      status: "success",
      message: "Lagu berhasil diperbarui",
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return h.response({
      status: "success",
      message: "Lagu berhasil dihapus",
    });
  }
}

module.exports = SongsHandler;
