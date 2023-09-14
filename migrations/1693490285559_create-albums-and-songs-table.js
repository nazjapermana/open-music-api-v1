exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
  });
  pgm.createTable("songs", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    title: {
      type: "varchar(100)",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
    performer: {
      type: "varchar(100)",
      notNull: true,
    },
    genre: {
      type: "varchar(100)",
      notNull: true,
    },
    duration: {
      type: "integer",
      notNull: false,
    },
    album_id: {
      type: "varchar",
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("albums");
  pgm.dropTable("songs");
};
