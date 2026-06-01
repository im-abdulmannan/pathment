module.exports = (sequelize, DataTypes) => {
  const ActivitySession = sequelize.define('ActivitySession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    date: {
      // One row per user per calendar day (UPSERT on date+userId)
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sessionStart: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'session_start',
    },
    sessionEnd: {
      type: DataTypes.DATE,
      field: 'session_end',
    },
    activeMinutes: {
      // Incremented by heartbeat (only counted when tab is visible)
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'active_minutes',
    },
    lastHeartbeat: {
      type: DataTypes.DATE,
      field: 'last_heartbeat',
    },
    pageViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'page_views',
    },
    eventsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'events_count',
    },
  }, {
    tableName: 'activity_sessions',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['date'] },
      { unique: true, fields: ['user_id', 'date'] },
    ],
  });

  ActivitySession.associate = (models) => {
    ActivitySession.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return ActivitySession;
};
