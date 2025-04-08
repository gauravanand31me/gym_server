module.exports = (sequelize, DataTypes) => {
    const Coupon = sequelize.define('Coupon', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        coupon_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        discount_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        discount_type: {
            type: DataTypes.ENUM('cash', 'percent'),
            allowNull: false
        },
        valid_from: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        valid_to: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'coupons' // explicitly define the table name
    });

    return Coupon;
};
