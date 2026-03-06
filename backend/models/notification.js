'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Notification extends Model {
		static associate(models) {
			Notification.belongsTo(models.User, { foreignKey: 'user_id' });
		}
	}
	Notification.init({
		message: DataTypes.TEXT,
		is_read: DataTypes.BOOLEAN,
		user_id: DataTypes.INTEGER,
		type: DataTypes.STRING,
		reference_id: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'Notification',
	});
	return Notification;
};
