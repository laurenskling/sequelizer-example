import Sequelize from 'sequelize';
import Faker from 'faker';
var util = require('util');

const shuffle = (array) => {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
};

const getSomeRandomFromArray = (array, times = 1) => {
  array = shuffle(array);
  return array.splice(0, times);
};

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
        const randomUsers = getSomeRandomFromArray(allUsers, Faker.random.number(5));
        // and add it as a friend
        user.addFriend(randomUsers);
      })
    });
  }
});

export default Conn;
