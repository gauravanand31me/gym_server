module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      daily: DataTypes.DECIMAL(10, 2),
      monthly: DataTypes.DECIMAL(10, 2),
      yearly: DataTypes.DECIMAL(10, 2),
    });
  
    Subscription.associate = (models) => {
      Subscription.belongsTo(models.Gym, { foreignKey: 'gymId' });
    };
  
    return Subscription;
  };
  