const userService = require("../services/user");
const { promise } = require("../middlewares/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = promise(async (req, res) => {
  const { name, email, password } = req.body;

  const emailExists = await userService.findUser({ email });
  if (emailExists)
    return res.status(400).json({ message: "Email already Exists" });

  const hash = bcrypt.hashSync(password, 10);

  const user = await userService.createUser({ name, email, password: hash });

  const newUserObj = userService.excludePassword({ user });

  res
    .status(200)
    .json({ message: "Successfully created user", user: newUserObj });
});

exports.login = promise(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findUser({ email });
  if (!user)
    return res.status(400).json({ message: "Credentials not matched" });

  const matchPassword = bcrypt.compareSync(password, user.password);
  if (!matchPassword)
    return res.status(400).json({ message: "Credentials not matched" });

  const newUserObj = userService.excludePassword({ user });

  const token = jwt.sign({ ...newUserObj }, process.env.ACCESS_TOKEN_SECRET);

  res.status(200).json({ token, user: newUserObj });
});
