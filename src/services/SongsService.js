const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { SongModel } = require("../utils/songs");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    if (title && performer) {
      const result = await this._pool.query(
        `SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%' AND lower(performer) LIKE '%${performer}%'`
      );
      return result.rows.map(SongModel);
    } else if (title || performer) {
      const result = await this._pool.query(
        `SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%' OR lower(performer) LIKE '%${performer}%'`
      );
      return result.rows.map(SongModel);
    } else {
      const result = await this._pool.query(
        "SELECT id, title, performer FROM songs"
      );
      return result.rows.map(SongModel);
    }
  }

  async getSongById(id) {
    const query = {
      text: "SELECT id, title, year, performer, genre, duration FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(SongModel)[0];
  }

  async updateSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id",
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan.");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus lagu, Id tidak ditemukan.");
    }
  }
}

module.exports = SongsService;