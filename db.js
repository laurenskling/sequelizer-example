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
const UserFriend = Conn.define('user_friend');
User.belongsToMany(User, { as: 'friends', through: UserFriend });

// create DB
Conn.sync({force: true}).then(() => {
    // create some users
    for (var i = 0; i < 10; i++) {
        User.create({
            name: Faker.name.findName()
        }).then((user) => {
            // create some friends for them
            for (var j = 0; j < Faker.random.number(10); j++) {
                user.createFriend({
                    name: Faker.name.findName()
                });
            }
        });
    }
});

export default Conn;
