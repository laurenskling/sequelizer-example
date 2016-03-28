import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema
} from 'graphql';

import Db from './db';

// make Friend into a schema Type.
const friendType = new GraphQLObjectType({
  name: "Friend",
  description: `Someone's friend`,
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: `The friend identifier.`,
      resolve(friend) {
          return friend.id;
      }
    },
    name: {
      type: GraphQLString,
      description: `What's his name again?`,
      resolve(friend) {
        return friend.name;
      }
    }
  })
});

// make User into a schema Type
var userType = new GraphQLObjectType({
  name: 'User',
  description: `One of the users who has many friends`,
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: `The user identifier.`,
      resolve(user) {
        return user.id;
      }
    },
    name: {
      type: GraphQLString,
      description: `The name of the user`,
      resolve(user) {
        console.log(user);
        return user.name;
      }
    },
    formatted: {
      type: GraphQLString,
      deprecationReason: `We don't like the formatted version anymore, it's depricated soon.`,
      description: `Show the user's id and name`,
      resolve(user) {
        return user.id + ': ' + user.name
      }
    },
    friends: {
      // make sure to wrap the friendType in a List
      type: new GraphQLList(userType),
      resolve(user) {
        return user.getFriends();
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'This is the root.',
  fields: () => {
    return {
      users: {
        type: new GraphQLList(userType),
        args: {
          id: {
            type: GraphQLInt
          },
          name: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return Db.models.user.findAll({where: args});
        }
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
