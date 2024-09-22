module.exports = (sequelize, DataTypes) => {
    const Equipment = sequelize.define('Equipment', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    Equipment.associate = (models) => {
      Equipment.belongsTo(models.Gym, { foreignKey: 'gymId' });
    };
  
    return Equipment;
  };
  