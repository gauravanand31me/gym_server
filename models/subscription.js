module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      daily: DataTypes.DECIMAL(10, 2),
      monthly: DataTypes.DECIMAL(10, 2),
      yearly: DataTypes.DECIMAL(10, 2),
      quarterly: DataTypes.DECIMAL(10, 2),      // <-- Add this
      halfYearly: DataTypes.DECIMAL(10, 2),     // <-- Add this
    });
  
    Subscription.associate = (models) => {
      Subscription.belongsTo(models.Gym, { foreignKey: 'gymId' });
    };
  
    return Subscription;
  };
  