import Users from '../models/Users';

export default class User {
  getUsers(req, res) {
    return res.send(Users);
  }
}
