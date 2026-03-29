import { param } from "express-validator";

const userIdValidator = [param("id").isMongoId().withMessage("Invalid user id.")];

export { userIdValidator };
