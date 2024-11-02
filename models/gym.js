const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Gym = sequelize.define("Gym", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    rating: {
      type: DataTypes.STRING,
      defaultValue: "0",
    },
    total_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pinCode: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    complete: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  // Hash password before creating or updating a gym
  Gym.beforeCreate(async (gym) => {
    const salt = await bcrypt.genSalt(10);
    gym.password = await bcrypt.hash(gym.password, salt);
  });

  Gym.beforeUpdate(async (gym) => {
    if (gym.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      gym.password = await bcrypt.hash(gym.password, salt);
    }
  });

  Gym.associate = (models) => {
    Gym.hasMany(models.GymImage, { foreignKey: "gymId", onDelete: "CASCADE" });
    Gym.hasMany(models.Equipment, { foreignKey: "gymId", onDelete: "CASCADE" });
    Gym.hasMany(models.Slot, { foreignKey: "gymId", onDelete: "CASCADE" });
    Gym.hasOne(models.Subscription, {
      foreignKey: "gymId",
      onDelete: "CASCADE",
    });
  };

  return Gym;
};
