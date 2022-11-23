import { DataTypes } from 'sequelize';

const Books = (sequelize) => {
	const Schema = {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ISBN: {
			type: DataTypes.STRING,
			allowNull: false
		},
		image: {
			type: DataTypes.STRING,
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false
		},
		isReserved: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		reservationDate: {
			type: DataTypes.DATEONLY
		},
		extendedTimes: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	};
	return sequelize.define('books', Schema);
};

export default Books;
