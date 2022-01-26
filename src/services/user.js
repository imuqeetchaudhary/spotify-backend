const { User } = require("../db/models/user");

exports.findUser = async ({ email }) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.createUser = async ({ name, email, password }) => {
  try {
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.excludePassword = ({ user }) => {
  try {
    const { password: pass, __v, ...rest } = user._doc;
    return rest;
  } catch (err) {
    throw new Error(err);
  }
};
