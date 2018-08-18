'use strict';
module.exports = (sequelize, DataTypes) => {
  var roles = sequelize.define('roles', {
    role_name: DataTypes.STRING
  }, {});
  roles.associate = function(models) {
    // associations can be defined here
    roles.hasMany(models.user);
  };
  return roles;
};