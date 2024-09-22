module.exports = (sequelize, DataTypes) => {
    const Slot = sequelize.define('Slot', {
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      startTime: DataTypes.TIME,
      timePeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    Slot.associate = (models) => {
      Slot.belongsTo(models.Gym, { foreignKey: 'gymId' });
    };
  
    return Slot;
  };
  