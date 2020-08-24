const User = require('../models/User');
const Yup = require('yup');

class UserController {

  async show(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'username', 'email']
    });

    res.json(users);
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion data fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      username: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validadion fails' });
    }

    const { email, username, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    try {
      const { id, name, username, Email, provider } = await user.update(req.body);
      res.json({ id, name, username, Email, provider });
    } catch (err) {
      return res.json(err);
    }
  }

  async delete(req, res) {
    const { password } = req.body;

    const user = await User.findByPk(req.userId);

    if(password && user && user.checkPassword(password)) {
      await user.destroy();
      res.status(204).json();
    }

    res.status(404).json();
  }
}

module.exports =  new UserController();
