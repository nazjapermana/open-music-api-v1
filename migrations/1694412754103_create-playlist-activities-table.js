/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist_activities", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    action: {
      type: "varchar(50)",
      notNull: true,
    },
    time: {
      type: "TEXT",
      notNull: true,
    },
    playlist_id: {
      type: "varchar(50)",
      notNull: true,
    },
    song_id: {
      type: "varchar(50)",
      notNull: true,
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlist_activities",
    "fk_playlist_avtivities.playlist_id_playlists.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    "playlist_activities",
    "fk_playlist_avtivities.playlist_id_playlists.id"
  );

  pgm.dropTable("playlist_activities");
};
