const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationsError = require("../exceptions/AuthorizationsError");

class PlaylistsService {
  constructor(songsService, collaborationsService) {
    this._pool = new Pool();
    this._songsService = songsService;
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT p."id", p."name", u.username FROM playlists AS p
      LEFT JOIN users AS u ON u."id" = p."owner"
      LEFT JOIN collaborations AS c ON p."id" = c.playlist_id
      WHERE c.user_id = $1 OR p."owner" = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;

    await this._songsService.getSongById(songId);

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal menambahkan lagu ke playlist");
    }
  }

  async getPlaylistSongs(id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getSongsByPlaylistId(id) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      LEFT JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu dalam playlist tidak ditemukan");
    }
  }

  async addActivityPlaylist({ playlistId, songId, userId, action }) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: "INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, action, time, playlistId, songId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal menambahkan aktivitas playlist");
    }
  }

  async getActivityPlaylists(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_activities.action, playlist_activities.time FROM playlist_activities
      LEFT JOIN users ON users.id = playlist_activities.user_id
      LEFT JOIN songs ON songs.id = playlist_activities.song_id
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationsError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
