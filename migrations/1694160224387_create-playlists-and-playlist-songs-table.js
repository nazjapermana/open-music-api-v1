/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    name: {
      type: "varchar(50)",
      notNull: true,
    },
    owner: {
      type: "varchar(50)",
      notNull: true,
    },
  });

  pgm.createTable("playlist_songs", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "varchar(50)",
      notNull: true,
    },
    song_id: {
      type: "varchar(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlists",
    "fk_playlists.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "playlist_songs",
    "fk_playlists.id_songs.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "playlist_songs",
    "fk_songs.id_playlists.id",
    "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("playlists", "fk_playlists.owner_users.id");
  pgm.dropConstraint("playlist_songs", "fk_playlists.id_songs.id");
  pgm.dropConstraint("playlist_songs", "fk_songs.id_playlists.id");

  pgm.dropTable("playlists");
  pgm.dropTable("playlist_songs");
};
