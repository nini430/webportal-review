import { StatusCodes } from "http-status-codes";

export const adminOnly = (req, res, next) => {
  if (req.role === "admin") {
    next();
  } else {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "action_not_allowed" });
  }
};
