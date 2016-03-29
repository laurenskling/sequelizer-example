import Sequelize from 'sequelize';
import Faker from 'faker';

const Conn = new Sequelize(
  'sequelize', // db name
  'root', // db user
  '', // db pass
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);

const User = Conn.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// set the relation, that User has friends that are Users
// const UserFriend = Conn.define('user_friend');
User.belongsToMany(User, { as: 'Friends', through: 'UserFriend' });

// create DB
Conn.sync({force: true}).then(() => {
  for (var i = 0; i < Faker.random.number(15); i++) {
    // create some users
    User.create({
      name: Faker.name.findName()
    }).then((user) => {
      // search all users
      User.findAll().then((allUsers) => {
        // to find one random user
        for (var j = 0; j < Faker.random.number(i); j++) {
          // and add it as a friend
          user.addFriend(allUsers[j]);
        }
      })
    });
  }
});

export default Conn;
