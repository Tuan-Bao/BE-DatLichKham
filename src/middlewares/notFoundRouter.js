import { StatusCodes } from "http-status-codes";

const notFoundRouter = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "The requested resource was not found on this server.",
  });
};

export default notFoundRouter;
