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
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: "NA"
    },
    token_expires: {
      type: DataTypes.STRING,
      defaultValue: "NA"
    },
    complete: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    gym_unique_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    }
  });

  // Hash password before creating or updating a gym
  Gym.beforeCreate(async (gym) => {
    const salt = await bcrypt.genSalt(10);
    gym.password = await bcrypt.hash(gym.password, salt);
    let uniqueId;
    do {
      uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
    } while (await Gym.findOne({ where: { gym_unique_id: uniqueId } }));
    gym.gym_unique_id = uniqueId;
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
    Gym.belongsToMany(models.Coupon, {
      through: models.CouponGymMap,
      foreignKey: 'gym_id'
    });
    Gym.hasMany(models.CouponGymMap, {
      foreignKey: 'gym_id'
    });
  };

  return Gym;
};
