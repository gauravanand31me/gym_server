module.exports = (sequelize, DataTypes) => {
    const GymImage = sequelize.define('GymImage', {
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    GymImage.associate = (models) => {
      GymImage.belongsTo(models.Gym, { foreignKey: 'gymId' });
    };
  
    return GymImage;
  };
  