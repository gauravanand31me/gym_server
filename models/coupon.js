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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'coupons', // explicitly define the table name
        timestamps: false, // ✅ Prevents Sequelize from adding createdAt/updatedAt
    });

    Coupon.associate = models => {
        Coupon.belongsToMany(models.Gym, {
          through: models.CouponGymMap,
          foreignKey: 'coupon_id'
        });
        Coupon.hasMany(models.CouponGymMap, {
          foreignKey: 'coupon_id'
        });
    };

    return Coupon;
};
