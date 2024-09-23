module.exports = (sequelize, DataTypes) => {
    const EquipmentList = sequelize.define('EquipmentList', {
        equipment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        equipment_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        equipment_details: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        equipment_icon_svg: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'EquipmentList' // Add this line to explicitly define the table name
    });

    return EquipmentList;
}


